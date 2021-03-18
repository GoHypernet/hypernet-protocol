export class VectorError extends Error {
  constructor(public sourceError?: Error, message?: string) {
    super(message);
  }
}
