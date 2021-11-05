export class HypertokenContractError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
