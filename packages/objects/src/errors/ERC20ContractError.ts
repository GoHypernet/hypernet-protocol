export class ERC20ContractError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
