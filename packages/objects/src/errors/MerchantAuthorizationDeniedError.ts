/**
 * MerchantAuthorizationDeniedError is thrown when the user will
 * not sign the merchant's signature, thereby authorizing the merchant's
 * code.
 * This is a fatal error for the merchant, and no retries should
 * be attempted.
 */
export class MerchantAuthorizationDeniedError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
