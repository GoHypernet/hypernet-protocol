export class GatewayActivationError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
