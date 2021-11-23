import { ProviderRpcError } from "@objects/errors/ProviderRpcError";
import errorCodes from "@objects/errors/errorCodes";

export class ERC20ContractError extends Error {
  protected errorCode: string = errorCodes[ERC20ContractError.name];
  constructor(message: string, public src?: ProviderRpcError | unknown) {
    super(`${message}: ${(src as any)?.data?.message}`);
  }
}
