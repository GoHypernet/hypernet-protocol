export class MerchantConnectorError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
