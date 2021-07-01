export class GatewayValidationError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
