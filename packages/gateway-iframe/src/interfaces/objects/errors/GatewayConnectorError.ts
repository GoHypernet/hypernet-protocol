export class GatewayConnectorError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
