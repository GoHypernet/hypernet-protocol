import { ProviderRpcError } from "@objects/errors/ProviderRpcError";
import errorCodes from "@objects/errors/errorCodes";

export class HypernetGovernorContractError extends Error {
  protected errorCode: string = errorCodes[HypernetGovernorContractError.name];
  constructor(message: string, public src?: ProviderRpcError | unknown) {
    super(
      `${message} ${
        (src as any)?.data?.message ? `: ${(src as any)?.data?.message}` : ``
      }`,
    );
  }
}
