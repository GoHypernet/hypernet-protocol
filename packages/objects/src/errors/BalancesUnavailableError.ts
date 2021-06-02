export class BalancesUnavailableError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
