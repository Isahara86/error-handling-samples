import { BlazeConsumerCartDto } from './blaze-consumer-cart.dto';

export class BlazeOrderHistory {
    orderId: number;

    blazeOrderId: string;

    originalOrder: any;

    blazeOrder: BlazeConsumerCartDto;

    onfleetTaskId: string;

    public static async findOne(req?: any): Promise<BlazeOrderHistory> {
        return null;
    }
    public async destroy(req?: any): Promise<BlazeOrderHistory> {
        return null;
    }
    public async save(req?: any): Promise<BlazeOrderHistory> {
        return null;
    }
}
