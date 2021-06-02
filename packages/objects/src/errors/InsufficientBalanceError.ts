export class InsufficientBalanceError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
