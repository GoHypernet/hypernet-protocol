import { ProviderRpcError } from "@objects/errors/ProviderRpcError";
import errorCodes from "@objects/errors/errorCodes";

export class RegistryFactoryContractError extends Error {
  protected errorCode: string = errorCodes[RegistryFactoryContractError.name];
  constructor(message: string, public src?: ProviderRpcError | unknown) {
    super(`${message}: ${(src as any)?.data?.message}`);
  }
}
