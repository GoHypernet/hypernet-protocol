export class MerchantValidationError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
