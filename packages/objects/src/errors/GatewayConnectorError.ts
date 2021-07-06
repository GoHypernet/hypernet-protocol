/**
 * GatewayConnectorError is a generic error type, that simply means
 * that the operation failed inside the gateway iframe for some reason.
 * We got a response, which will be recorded in the error.
 */
export class GatewayConnectorError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}