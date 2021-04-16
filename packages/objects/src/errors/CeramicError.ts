export class CeramicError extends Error {
  constructor(public sourceError?: Error, message?: string) {
    super(message);
  }
}
