export class NonFungibleRegistryEnumerableUpgradeableContractError extends Error {
  constructor(message?: string, public src?: unknown) {
    super(message);
  }
}
