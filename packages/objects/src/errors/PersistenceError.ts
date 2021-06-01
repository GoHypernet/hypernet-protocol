export class PersistenceError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
