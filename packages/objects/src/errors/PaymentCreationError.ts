export class PaymentCreationError extends Error {
  constructor(public sourceError?: Error, message?: string) {
    super(message);
  }
}
