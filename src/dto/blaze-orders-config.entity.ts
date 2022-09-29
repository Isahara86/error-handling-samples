export default class BlazeOrdersConfig {
    apiUrl: string;

    partnerKey: string;

    authorization: string;

    depotId: number;

    terminalId: string;

    employeeId: string;

    deliveryFeeProductId: string;

    adjustmentProductId: string;

    shopId: string;

    public static async findOne(req?: any): Promise<BlazeOrdersConfig> {
        return null;
    }
    public async destroy(req?: any): Promise<BlazeOrdersConfig> {
        return null;
    }
}
