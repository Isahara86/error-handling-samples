import { BaseBlazeOrderHandlingError } from './base-blaze-order-handling-error';

export class OrderHasNoChangesError extends BaseBlazeOrderHandlingError {
    prevOrder?: any;
}
