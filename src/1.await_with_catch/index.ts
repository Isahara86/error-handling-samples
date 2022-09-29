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

const sequelize: any = null;
const transaction: any = null;
const lockQueryStr: any = null;
const logger: any = null;

async function handeOrderCancel(order: any): Promise<void> {
    const handleLog: IOrderHandleLog = {
        order,
        isSuccess: false,
    };

    await transaction(async (transaction) => {
        await sequelize.query(lockQueryStr, { transaction });

        const config = await BlazeOrdersConfig.findOne({ where: { depotId: order.depotId } });
        if (!config) {
            return;
        }

        const prevOrderHistory = await BlazeOrderHistory.findOne({ where: { orderId: order.id } });
        if (!prevOrderHistory) {
            return;
        }

        await deleteCartOrTransaction(order.cancelReason, prevOrderHistory, config).catch(
            (err) => (handleLog.prevOrderCancelErr = err),
        );

        if (handleLog.prevOrderCancelErr) {
            return finishOrderHandling(handleLog);
        } else {
            await prevOrderHistory.destroy({ transaction });
            handleLog.isSuccess = true;
            finishOrderHandling(handleLog).catch((err) => logger.error(err));
        }
    }).catch((err) => {
        handleLog.jsError = err;
        finishOrderHandling(handleLog).catch((err) => logger.error(err));
        return Promise.reject(err);
    });
}

async function handleOrderCheckedOut(order: any): Promise<void> {
    const handleLog: IOrderHandleLog = {
        order,
        isSuccess: false,
    };

    await transaction(async (transaction) => {
        await sequelize.query(lockQueryStr, { transaction });

        const config = await BlazeOrdersConfig.findOne({ where: { depotId: order.depotId } });
        if (!config) {
            return;
        }

        const userDocuments = await findUserDocuments(order.userId);
        if (!userDocuments.userIdDocument) {
            handleLog.errorDescription = 'no valid userIdDocument found';
            return finishOrderHandling(handleLog);
        }

        await createBlazeUserIfNotExist(order.userId, userDocuments, config)
            .then((id) => (handleLog.blazeUserId = id))
            .catch((err) => {
                handleLog.ensureBlazeUserErr = err;
            });
        if (!handleLog.blazeUserId) {
            return finishOrderHandling(handleLog);
        }

        const prevOrderHistory = await BlazeOrderHistory.findOne({ where: { orderId: order.id } });

        const hasChanges = prevOrderHistory?.originalOrder
            ? checkIfOrderHasChanges(prevOrderHistory.originalOrder, order)
            : true;

        if (!hasChanges) {
            handleLog.ensureBlazeUserErr = 'order has no changes';
            handleLog.prevOrder = prevOrderHistory?.originalOrder;
            return finishOrderHandling(handleLog);
        }

        await buildBlazeOrder(order, handleLog.blazeUserId, config)
            .then((o) => (handleLog.blazeOrder = o))
            .catch((err) => (handleLog.buildBlazeOrderErr = err));
        if (!handleLog.blazeOrder) {
            return finishOrderHandling(handleLog);
        }

        const orderHistory = new BlazeOrderHistory();
        orderHistory.orderId = order.id;
        orderHistory.originalOrder = order;

        if (prevOrderHistory) {
            await deleteCartOrTransaction('customer changed order', prevOrderHistory, config).catch(
                (err) => (handleLog.prevOrderCancelErr = err),
            );

            if (handleLog.prevOrderCancelErr) {
                return finishOrderHandling(handleLog);
            }
            await prevOrderHistory.destroy();
        }

        await getCart(handleLog.blazeUserId, config)
            .then((c) => (handleLog.activeCart = c))
            .catch((err) => (handleLog.getCartErr = err));
        if (!handleLog.activeCart) {
            return finishOrderHandling(handleLog);
        }

        handleLog.activeCart.cart.items = handleLog.blazeOrder.items;
        handleLog.activeCart.completeAfter = handleLog.blazeOrder.completeAfter;
        handleLog.activeCart.deliveryDate = handleLog.blazeOrder.deliveryDate;
        handleLog.activeCart.deliveryAddress = handleLog.blazeOrder.deliveryAddress;

        await calcCart(handleLog.blazeUserId, handleLog.activeCart, config)
            .then((c) => (handleLog.preparedCart1 = c))
            .catch((err) => (handleLog.calcCartErr1 = err));
        if (handleLog.calcCartErr1) {
            return finishOrderHandling(handleLog);
        }

        handleLog.preparedCart1Adjusted = _.cloneDeep(handleLog.preparedCart1);
        handleLog.preparedCart1Adjusted.cart.items = adjustBlazeCartItemsStep1(
            order,
            handleLog.blazeOrder,
            handleLog.preparedCart1.cart.items,
            config,
        );

        await calcCart(handleLog.blazeUserId, handleLog.preparedCart1Adjusted, config)
            .then((c) => (handleLog.preparedCart2 = c))
            .catch((err) => (handleLog.calcCartErr2 = err));
        if (handleLog.calcCartErr2) {
            return finishOrderHandling(handleLog);
        }

        handleLog.preparedCart2Adjusted = adjustBlazeCartItemsStep2(
            order,
            handleLog.preparedCart2,
            config,
        );
        let createdBlazeOrder: BlazeConsumerCartDto;
        await checkoutCart(handleLog.blazeUserId, handleLog.preparedCart2Adjusted, config)
            .then((c) => (createdBlazeOrder = c))
            .catch((err) => (handleLog.checkoutCartErr = err));

        if (handleLog.checkoutCartErr) {
            return finishOrderHandling(handleLog);
        }

        orderHistory.blazeOrderId = createdBlazeOrder.id;
        orderHistory.blazeOrder = createdBlazeOrder;
        await orderHistory.save({ transaction });
        handleLog.isSuccess = true;
        finishOrderHandling(handleLog).catch((err) => logger.error(err));
    }).catch((err) => {
        handleLog.jsError = err;
        finishOrderHandling(handleLog).catch((err) => logger.error(err));
        return Promise.reject(err);
    });
}
