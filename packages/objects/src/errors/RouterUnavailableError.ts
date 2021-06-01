export class RouterUnavailableError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
