export class PreferredPaymentTokenError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
