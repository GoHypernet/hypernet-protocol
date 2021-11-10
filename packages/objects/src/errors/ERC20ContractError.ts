import { ProviderRpcError } from "@objects/errors/ProviderRpcError";

export class ERC20ContractError extends Error {
  constructor(message: string, public src?: ProviderRpcError | unknown) {
    super(message);
  }
}
