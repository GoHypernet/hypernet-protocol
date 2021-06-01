export class LogicalError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
