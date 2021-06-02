export class PostmateError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
