import { ProviderRpcError } from "@objects/errors/ProviderRpcError";

export class NonFungibleRegistryContractError extends Error {
  constructor(message?: string, public src?: ProviderRpcError | unknown) {
    super(message);
  }
}
