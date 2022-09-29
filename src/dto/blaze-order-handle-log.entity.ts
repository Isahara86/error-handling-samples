import { BlazeConsumerCartDto } from './blaze-consumer-cart.dto';
import { BlazeOrderCreateDto } from './blaze-order-create.dto';

export default class BlazeOrderHandleLog {
    orderId: number;

    originalOrder: any;

    prevOrder: any;

    blazeUserId?: string;

    ensureBlazeUserErr?: any;

    blazeOrder?: BlazeOrderCreateDto;

    buildBlazeOrderErr?: any;

    prevOrderCancelErr?: any;

    activeCart?: BlazeConsumerCartDto;

    getCartErr?: any;

    preparedCart1?: BlazeConsumerCartDto;

    preparedCart1Adjusted?: BlazeConsumerCartDto;

    calcCartErr1?: any;

    preparedCart2?: BlazeConsumerCartDto;

    preparedCart2Adjusted?: BlazeConsumerCartDto;

    calcCartErr2?: any;

    checkoutCartErr?: any;

    jsError?: any;

    errorDescription?: string;

    isSuccess?: boolean;

    public async save(req?: any): Promise<void> {
        return null;
    }
}
