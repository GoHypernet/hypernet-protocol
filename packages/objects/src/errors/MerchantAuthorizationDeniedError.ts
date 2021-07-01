/**
 * MerchantAuthorizationDeniedError is thrown when the user will
 * not sign the gateway's signature, thereby authorizing the gateway's
 * code.
 * This is a fatal error for the gateway, and no retries should
 * be attempted.
 */
export class MerchantAuthorizationDeniedError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
