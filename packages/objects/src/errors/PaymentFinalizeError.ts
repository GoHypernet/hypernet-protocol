export class PaymentFinalizeError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
