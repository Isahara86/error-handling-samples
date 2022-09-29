import { IOrderHandleLog } from '../dto/blaze-order-handle-log.interface';
import * as _ from 'lodash';
import { BlazeOrderHistory } from '../dto/blaze-order-history.entity';
import BlazeOrdersConfig from '../dto/blaze-orders-config.entity';
import { BlazeConsumerCartDto } from '../dto/blaze-consumer-cart.dto';
import {
    adjustBlazeCartItemsStep1,
    adjustBlazeCartItemsStep2,
    buildBlazeOrder,
    calcCart,
    checkIfOrderHasChanges,
    checkoutCart,
    createBlazeUserIfNotExist,
    deleteCartOrTransaction,
    findUserDocuments,
    finishOrderHandling,
    getCart,
} from '../common';
import { DeleteCartError } from './errors/delete-cart-error';
import { BaseBlazeOrderHandlingError } from './errors/base-blaze-order-handling-error';
import { IUserDocuments } from '../dto/user-documents.interface';
import { FindUserDocumentsError } from './errors/find-user-documents-error';
import { CreateUserIfNotExistError } from './errors/create-user-if-not-exist-error';
import { OrderHasNoChangesError } from './errors/order-has-no-changes-error';
import { BlazeOrderCreateDto } from '../dto/blaze-order-create.dto';
import { BuildBlazeOrderError } from './errors/build-blaze-order-error';
import { GetCartError } from './errors/get-cart-error';
import { CalcCartStep1Error } from './errors/calc-cart-step1-error';
import { CalcCartStep2Error } from './errors/calc-cart-step2-error';
import { CartCheckoutError } from './errors/cart-checkout-error';

const sequelize: any = null;
const transaction: any = null;
const lockQueryStr: any = null;
const logger: any = null;

async function handeOrderCancel(order: any): Promise<void> {
    const handleLog: IOrderHandleLog = {
        order,
        isSuccess: false,
    };
    try {
        await transaction(async (transaction) => {
            await sequelize.query(lockQueryStr, { transaction });

            const config = await BlazeOrdersConfig.findOne({ where: { depotId: order.depotId } });
            if (!config) {
                return;
            }

            const prevOrderHistory = await BlazeOrderHistory.findOne({
                where: { orderId: order.id },
            });
            if (!prevOrderHistory) {
                return;
            }

            await deleteCartOrTransactionWrapper(order.cancelReason, prevOrderHistory, config);

            await prevOrderHistory.destroy({ transaction });
            handleLog.isSuccess = true;
            finishOrderHandling(handleLog).catch((err) => logger.error(err));
        });
    } catch (err) {
        return saveOrderHandleError(err, handleLog);
    }
}

async function handleOrderCheckedOut(order: any): Promise<void> {
    const handleLog: IOrderHandleLog = {
        order,
        isSuccess: false,
    };

    try {
        await transaction(async (transaction) => {
            await sequelize.query(lockQueryStr, { transaction });

            const config = await BlazeOrdersConfig.findOne({ where: { depotId: order.depotId } });
            if (!config) {
                return;
            }

            const userDocuments = await findUserDocumentsWrapper(order.userId);

            handleLog.blazeUserId = await createBlazeUserIfNotExistWrapper(
                order.userId,
                userDocuments,
                config,
            );

            const prevOrderHistory = await BlazeOrderHistory.findOne({
                where: { orderId: order.id },
            });

            await throwErrorIfOrderHasNoChanges(order, prevOrderHistory);

            handleLog.blazeOrder = await buildBlazeOrderWrapper(
                order,
                handleLog.blazeUserId,
                config,
            );

            const orderHistory = new BlazeOrderHistory();
            orderHistory.orderId = order.id;
            orderHistory.originalOrder = order;

            if (prevOrderHistory) {
                await deleteCartOrTransactionWrapper(
                    'customer changed order',
                    prevOrderHistory,
                    config,
                );

                await prevOrderHistory.destroy();
            }

            handleLog.activeCart = await getCartWrapper(handleLog.blazeUserId, config);

            handleLog.activeCart.cart.items = handleLog.blazeOrder.items;
            handleLog.activeCart.completeAfter = handleLog.blazeOrder.completeAfter;
            handleLog.activeCart.deliveryDate = handleLog.blazeOrder.deliveryDate;
            handleLog.activeCart.deliveryAddress = handleLog.blazeOrder.deliveryAddress;

            handleLog.preparedCart1 = await calcCartStep1Wrapper(
                handleLog.blazeUserId,
                handleLog.activeCart,
                config,
            );

            handleLog.preparedCart1Adjusted = _.cloneDeep(handleLog.preparedCart1);
            handleLog.preparedCart1Adjusted.cart.items = adjustBlazeCartItemsStep1(
                order,
                handleLog.blazeOrder,
                handleLog.preparedCart1.cart.items,
                config,
            );

            handleLog.preparedCart2 = await calcCartStep2Wrapper(
                handleLog.blazeUserId,
                handleLog.preparedCart1Adjusted,
                config,
            );

            handleLog.preparedCart2Adjusted = adjustBlazeCartItemsStep2(
                order,
                handleLog.preparedCart2,
                config,
            );
            const createdBlazeOrder = await checkoutCartWrapper(
                handleLog.blazeUserId,
                handleLog.preparedCart2Adjusted,
                config,
            );

            orderHistory.blazeOrderId = createdBlazeOrder.id;
            orderHistory.blazeOrder = createdBlazeOrder;
            await orderHistory.save({ transaction });
            handleLog.isSuccess = true;
            finishOrderHandling(handleLog).catch((err) => logger.error(err));
        });
    } catch (err) {
        return saveOrderHandleError(err, handleLog);
    }
}

async function saveOrderHandleError(err: any, handleLog: IOrderHandleLog) {
    if (err instanceof BaseBlazeOrderHandlingError) {
        switch (err.constructor) {
            case DeleteCartError:
                handleLog.prevOrderCancelErr = err.originalError;
                break;
            case FindUserDocumentsError:
                handleLog.errorDescription = 'no valid userIdDocument found';
                break;
            case CreateUserIfNotExistError:
                handleLog.ensureBlazeUserErr = err;
                break;
            case OrderHasNoChangesError:
                handleLog.ensureBlazeUserErr = 'order has no changes';
                handleLog.prevOrder = err.prevOrder;
                break;
            case BuildBlazeOrderError:
                handleLog.buildBlazeOrderErr = err;
                break;
            case GetCartError:
                handleLog.getCartErr = err;
                break;
            case CalcCartStep1Error:
                handleLog.calcCartErr1 = err;
                break;
            case CalcCartStep2Error:
                handleLog.calcCartErr2 = err;
                break;
            case CartCheckoutError:
                handleLog.checkoutCartErr = err;
                break;

            default:
                handleLog.jsError = err;
        }

        return finishOrderHandlingWrapper(handleLog);
    } else {
        handleLog.jsError = err;
        await finishOrderHandlingWrapper(handleLog);
        return Promise.reject(err);
    }
}

async function deleteCartOrTransactionWrapper(
    reason: string,
    prevOrderHistory: any,
    config: any,
): Promise<void> {
    try {
        await deleteCartOrTransaction(reason, prevOrderHistory, config);
    } catch (err) {
        throw new DeleteCartError(err);
    }
}

async function findUserDocumentsWrapper(userId: number): Promise<IUserDocuments> {
    const userDocuments = await findUserDocuments(userId);

    if (!userDocuments.userIdDocument) {
        throw new FindUserDocumentsError();
    }

    return userDocuments;
}

async function createBlazeUserIfNotExistWrapper(
    userId: number,
    documents: any,
    config: any,
): Promise<string> {
    try {
        return await createBlazeUserIfNotExist(userId, documents, config);
    } catch (err) {
        throw new CreateUserIfNotExistError(err);
    }
}

async function throwErrorIfOrderHasNoChanges(order: any, prevOrderHistory?: BlazeOrderHistory) {
    const hasChanges = prevOrderHistory?.originalOrder
        ? checkIfOrderHasChanges(prevOrderHistory.originalOrder, order)
        : true;

    if (!hasChanges) {
        const err = new OrderHasNoChangesError();
        err.prevOrder = prevOrderHistory?.originalOrder;
        throw err;
    }
}

async function buildBlazeOrderWrapper(
    order: any,
    blazeUserId: string,
    config: BlazeOrdersConfig,
): Promise<BlazeOrderCreateDto> {
    try {
        return await buildBlazeOrder(order, blazeUserId, config);
    } catch (err) {
        throw new BuildBlazeOrderError();
    }
}

async function getCartWrapper(
    cuid: string,
    config: BlazeOrdersConfig,
): Promise<BlazeConsumerCartDto> {
    try {
        return await getCart(cuid, config);
    } catch (err) {
        throw new GetCartError();
    }
}

export async function calcCartStep1Wrapper(
    cuid: string,
    cartObj: BlazeConsumerCartDto,
    config: BlazeOrdersConfig,
): Promise<BlazeConsumerCartDto> {
    try {
        return await calcCart(cuid, cartObj, config);
    } catch (err) {
        throw new CalcCartStep1Error();
    }
}

export async function calcCartStep2Wrapper(
    cuid: string,
    cartObj: BlazeConsumerCartDto,
    config: BlazeOrdersConfig,
): Promise<BlazeConsumerCartDto> {
    try {
        return await calcCart(cuid, cartObj, config);
    } catch (err) {
        throw new CalcCartStep2Error();
    }
}

export async function checkoutCartWrapper(
    cuid: string,
    cart: BlazeConsumerCartDto,
    config: BlazeOrdersConfig,
): Promise<BlazeConsumerCartDto> {
    try {
        return await checkoutCart(cuid, cart, config);
    } catch (err) {
        throw new CartCheckoutError();
    }
}

async function finishOrderHandlingWrapper(orderHandlingLog: IOrderHandleLog): Promise<void> {
    try {
        await finishOrderHandling(orderHandlingLog);
    } catch (err) {
        logger.error(err);
    }
}
