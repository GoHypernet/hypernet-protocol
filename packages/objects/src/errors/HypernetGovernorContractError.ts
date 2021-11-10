import { ProviderRpcError } from "@objects/errors/ProviderRpcError";

export class HypernetGovernorContractError extends Error {
  constructor(message: string, public src?: ProviderRpcError | unknown) {
    super(`${message}: ${(src as any)?.data?.message}`);
  }
}
