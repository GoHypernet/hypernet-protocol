export class NonFungibleRegistryContractError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
