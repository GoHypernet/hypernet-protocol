/**
 * MerchantConnectorError is a generic error type, that simply means
 * that the operation failed inside the merchant iframe for some reason.
 * We got a response, which will be recorded in the error.
 */
export class MerchantConnectorError extends Error {
    constructor(message?: string,
        public sourceErr?: Error) {
        super(message);
    }
}
