import { ProviderRpcError } from "@objects/errors/ProviderRpcError";
import errorCodes from "@objects/errors/errorCodes";

export class NonFungibleRegistryContractError extends Error {
  protected errorCode: string =
    errorCodes[NonFungibleRegistryContractError.name];
  constructor(message?: string, public src?: ProviderRpcError | unknown) {
    super(`${message}: ${(src as any)?.data?.message}`);
  }
}
