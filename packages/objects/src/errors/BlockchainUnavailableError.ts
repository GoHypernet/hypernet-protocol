export class BlockchainUnavailableError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
