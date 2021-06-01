export class InvalidPaymentIdError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
