export class TransferCreationError extends Error {
  constructor(public sourceError?: Error, message?: string) {
    super(message);
  }
}
