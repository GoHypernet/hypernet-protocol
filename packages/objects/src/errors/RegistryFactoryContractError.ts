import { ProviderRpcError } from "@objects/errors/ProviderRpcError";
console.log("ProviderRpcError11: ", ProviderRpcError);

export class RegistryFactoryContractError extends Error {
  constructor(message: string, public src?: ProviderRpcError | unknown) {
    super(message);
  }
}
