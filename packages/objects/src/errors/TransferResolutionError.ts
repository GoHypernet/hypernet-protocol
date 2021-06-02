export class TransferResolutionError extends Error {
  constructor(public sourceError?: Error, message?: string) {
    super(message);
  }
}
