import axios from 'axios';
import FromData from 'form-data';
import { IOrderHandleLog } from './dto/blaze-order-handle-log.interface';
import BlazeOrderHandleLog from './dto/blaze-order-handle-log.entity';
import { IUserDocuments } from './dto/user-documents.interface';
import BlazeOrdersConfig from './dto/blaze-orders-config.entity';
import { BlazeOrderCreateDto } from './dto/blaze-order-create.dto';
import { BlazeConsumerCartDto, BlazeConsumerCartItem } from './dto/blaze-consumer-cart.dto';
import * as _ from 'lodash';

export async function deleteCartOrTransaction(
    reason: string,
    { blazeOrder: { consumerId, id } }: any,
    { apiUrl, partnerKey, authorization, employeeId, terminalId }: any,
): Promise<void> {
    const orderRes = await axios({
        method: 'get',
        url: `${apiUrl}/v1/partner/store/cart/${id}?cuid=${consumerId}`,
        headers: {
            'X-API-KEY': partnerKey,
            Authorization: authorization,
        },
    });

    const transactionId = (orderRes.data as any).transactionId;

    if (transactionId) {
        await axios({
            method: 'delete',
            url: `${apiUrl}/v1/partner/transactions/${transactionId}`,
            headers: {
                'X-API-KEY': partnerKey,
                Authorization: authorization,
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                employeeId,
                reason,
                terminalId,
            }),
        });
    } else {
        await axios({
            method: 'delete',
            url: `${apiUrl}/v1/partner/store/cart/cancelCart/${id}?cuid=${consumerId}`,
            headers: {
                'X-API-KEY': partnerKey,
                Authorization: authorization,
            },
        });
    }
}

export async function createBlazeUserIfNotExist(
    userId: number,
    documents: any,
    config: any,
): Promise<string> {
    const user = await this.mq.findMarketUser({ id: userId });
    const blazeEmail = `${user.id}djdbszab@integrations.blaze.me`;

    let blazeUser = await this.findBlazeUser(blazeEmail, config);

    if (!blazeUser) {
        blazeUser = await this.registerBlazeUser(blazeEmail, user, config);
    }

    await this.updateBlazeUser(blazeUser, documents, config);

    return blazeUser.id;
}

export async function updateBlazeUser(
    blazeUser,
    { userIdDocument, userMedicalDocument }: any,
    config: any,
): Promise<void> {
    const { apiUrl, partnerKey, authorization } = config;
    let hasChanges = false;

    if (userIdDocument.documentNumber !== blazeUser.dlNo) {
        await this.uploadConsumerDocument(blazeUser.id, userIdDocument, config, 'userId');
        hasChanges = true;
        blazeUser.dlNo = userIdDocument.documentNumber;
        blazeUser.dlExpiration = new Date(userIdDocument.expirationDate).getTime();
    }

    if (userMedicalDocument && userMedicalDocument.documentNumber !== blazeUser.recNo) {
        await this.uploadConsumerDocument(blazeUser.id, userMedicalDocument, config, 'medical');
        hasChanges = true;

        blazeUser.recNo = userMedicalDocument.documentNumber;
        blazeUser.recExpiration = new Date(userMedicalDocument.expirationDate).getTime();
    }

    if (!hasChanges) {
        return;
    }

    await axios({
        method: 'post',
        url: `${apiUrl}/v1/partner/store/user?cuid=${blazeUser.id}`,
        headers: {
            'X-API-KEY': partnerKey,
            Authorization: authorization,
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(blazeUser),
    });
}

export async function registerBlazeUser(blazeEmail: string, user: any, config: any): Promise<any> {
    const { apiUrl, partnerKey, authorization } = config;
    const reqData: any = {
        firstName: user.firstName,
        lastName: user.lastName,
        dob: new Date(user.dob).getTime(),
        sex: '0',
        email: blazeEmail,
        password: blazeEmail,
        phoneNumber: user.phone,
    };

    const response = await axios({
        method: 'post',
        url: `${apiUrl}/v1/partner/user/register`,
        headers: {
            'X-API-KEY': partnerKey,
            Authorization: authorization,
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(reqData),
    });

    return response.data;
}

export async function uploadConsumerDocument(
    cuid: string,
    { id, fileUrl }: any,
    { apiUrl, partnerKey, authorization }: any,
    type: 'userId' | 'medical',
): Promise<any> {
    const formData = new FromData();
    formData.append('name', id.toString());
    formData.append('assetType', 'Photo');
    const fileRes = await axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
    });
    formData.append('file', fileRes.data);

    const response = await axios({
        method: 'post',
        url:
            type === 'userId'
                ? `${apiUrl}/v1/partner/store/user/dlPhoto?cuid=${cuid}`
                : `${apiUrl}/v1/partner/store/user/recPhoto?cuid=${cuid}`,
        headers: {
            'X-API-KEY': partnerKey,
            Authorization: authorization,
            ...formData.getHeaders(),
        },
        data: formData,
    });

    return response.data;
}

export async function findBlazeUser(
    email: string,
    { apiUrl, partnerKey, authorization }: any,
): Promise<any> {
    const response = await axios({
        method: 'post',
        url: `${apiUrl}/v1/partner/user/login`,
        headers: {
            'X-API-KEY': partnerKey,
            Authorization: authorization,
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            email,
            password: email,
        }),
    }).catch((err) => {
        if (err.response.status === 401) {
            // user not found
            return Promise.resolve(null);
        }
        return Promise.reject(err);
    });

    return response?.data?.user;
}

export async function findUserDocuments(userId: number): Promise<IUserDocuments> {
    return {
        userIdDocument: null,
        userMedicalDocument: null,
    };
}

export function checkIfOrderHasChanges(o1: any, o2: any): boolean {
    for (const o1Sku of o1.skus) {
        const o2Sku = o2.skus.find((s) => s.skuId === o1Sku.skuId);

        if (o1Sku.quantity !== o2Sku?.quantity) {
            return true;
        }
    }

    return (
        o1.skus.length !== o2.skus.length ||
        o1.totalPrice !== o2.totalPrice ||
        o1.timeslotId !== o2.timeslotId ||
        o1.addressId !== o2.addressId
    );
}


export function adjustBlazeCartItemsStep1(
    order: any,
    blazeOrder: BlazeOrderCreateDto,
    blazeCartItems: BlazeConsumerCartItem[],
    config: BlazeOrdersConfig,
): BlazeConsumerCartItem[] {
    const newCartItems: BlazeConsumerCartItem[] = [];
    for (const { price, productId, quantity } of blazeOrder.items) {
        const cartItem = blazeCartItems.find(
            (it) => it.productId === productId && it.quantity === quantity,
        );

        blazeCartItems = blazeCartItems.filter((itt) => itt !== cartItem);

        cartItem.overridePrice = price / 100;
        newCartItems.push(cartItem);
    }

    if (order.shippingTotalPrice) {
        newCartItems.push({
            productId: config.deliveryFeeProductId,
            quantity: 1,
            overridePrice: order.shippingTotalPrice / 100,
        });
    }

    return newCartItems;
}

export function adjustBlazeCartItemsStep2(
    order: any,
    preparedCart2: BlazeConsumerCartDto,
    config: BlazeOrdersConfig,
): BlazeConsumerCartDto {
    preparedCart2 = _.cloneDeep(preparedCart2);

    const afterTaxDiscount = (Math.trunc(preparedCart2.cart.total * 100) - order.totalPrice) / 100;

    if (afterTaxDiscount > 0) {
        preparedCart2.cart.afterTaxDiscount = afterTaxDiscount;
    } else if (afterTaxDiscount < 0) {
        preparedCart2.cart.items.push({
            productId: config.adjustmentProductId,
            quantity: 1,
            overridePrice: Math.abs(afterTaxDiscount),
        });
    }

    return preparedCart2;
}

// 1. get cart ID
export async function getCart(
    cuid: string,
    { apiUrl, partnerKey, authorization }: BlazeOrdersConfig,
): Promise<BlazeConsumerCartDto> {
    const response = await axios({
        method: 'get',
        url: `${apiUrl}/v1/partner/store/cart/active?cuid=${cuid}`,
        headers: {
            'X-API-KEY': partnerKey,
            Authorization: authorization,
        },
    });

    return response.data;
}

// 2. calc cart
export async function calcCart(
    cuid: string,
    cartObj: BlazeConsumerCartDto,
    { apiUrl, partnerKey, authorization }: BlazeOrdersConfig,
): Promise<BlazeConsumerCartDto> {
    const response = await axios({
        method: 'post',
        url: `${apiUrl}/v1/partner/store/cart/prepare?cuid=${cuid}`,
        headers: {
            'X-API-KEY': partnerKey,
            Authorization: authorization,
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(cartObj),
    });

    return response.data;
}

// 3. submit cart
export async function checkoutCart(
    cuid: string,
    cart: BlazeConsumerCartDto,
    { apiUrl, partnerKey, authorization }: BlazeOrdersConfig,
): Promise<BlazeConsumerCartDto> {
    const response = await axios({
        method: 'post',
        url: `${apiUrl}/v1/partner/store/cart/submitCart/${cart.id}?cuid=${cuid}`,
        headers: {
            'X-API-KEY': partnerKey,
            Authorization: authorization,
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(cart),
    });

    return response.data;
}

export async function buildBlazeOrder(
    order: any,
    blazeUserId: string,
    config: BlazeOrdersConfig,
): Promise<BlazeOrderCreateDto> {
    const items = await this.formatBlazeOrderItems(order, config);
    const timeInfo = await this.getTimeInfo(order);
    const deliveryAddress = await this.getBlazeAddress(order);

    return {
        blazeUserId,
        items,
        total: order.totalPrice / 100,
        deliveryAddress,
        deliveryDate: timeInfo.deliveryDate,
        completeAfter: timeInfo.completeAfter,
    };
}

export async function finishOrderHandling({
    activeCart,
    getCartErr,
    blazeOrder,
    blazeUserId,
    buildBlazeOrderErr,
    calcCartErr1,
    calcCartErr2,
    checkoutCartErr,
    ensureBlazeUserErr,
    prevOrderCancelErr,
    errorDescription,
    order,
    preparedCart1,
    preparedCart1Adjusted,
    preparedCart2,
    preparedCart2Adjusted,
    prevOrder,
    jsError,
    isSuccess,
}: IOrderHandleLog): Promise<void> {
    const log = new BlazeOrderHandleLog();
    log.orderId = order.id;
    log.originalOrder = order;
    log.prevOrder = prevOrder;
    log.blazeUserId = blazeUserId;
    log.ensureBlazeUserErr = formatErrorForDb(ensureBlazeUserErr);
    log.blazeOrder = blazeOrder;
    log.buildBlazeOrderErr = formatErrorForDb(buildBlazeOrderErr);
    log.prevOrderCancelErr = formatErrorForDb(prevOrderCancelErr);
    log.activeCart = activeCart;
    log.getCartErr = formatErrorForDb(getCartErr);
    log.preparedCart1 = preparedCart1;
    log.preparedCart1Adjusted = preparedCart1Adjusted;
    log.calcCartErr1 = formatErrorForDb(calcCartErr1);
    log.preparedCart2 = preparedCart2;
    log.preparedCart2Adjusted = preparedCart2Adjusted;
    log.calcCartErr2 = formatErrorForDb(calcCartErr2);
    log.checkoutCartErr = formatErrorForDb(checkoutCartErr);
    log.jsError = formatErrorForDb(jsError);
    log.errorDescription = errorDescription;
    log.isSuccess = isSuccess;

    await log.save();

    this.blazeOrderNotificationService
        .handleBlazeOrderLog(log)
        .catch((err) => this.logger.error(err));
}

export function formatErrorForDb(err: any): any {
    if (err?.isAxiosError) {
        const errorObj = err.toJSON();
        errorObj.data = err.response?.data || errorObj.data;
        err = errorObj;
    }
    if (err instanceof Error) {
        err = { jsError: err.stack };
    }

    return err;
}
