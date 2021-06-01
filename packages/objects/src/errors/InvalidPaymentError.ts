export class InvalidPaymentError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
