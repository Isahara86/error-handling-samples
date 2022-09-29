export abstract class BaseBlazeOrderHandlingError extends Error {
    constructor(public originalError?: Error | any) {
        super();
    }
}
