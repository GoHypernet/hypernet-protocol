export class RouterChannelUnknownError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
