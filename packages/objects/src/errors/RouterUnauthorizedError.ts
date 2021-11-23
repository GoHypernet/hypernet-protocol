import errorCodes from "@objects/errors/errorCodes";
import { GatewayUrl } from "@objects/GatewayUrl";

export class RouterUnauthorizedError extends Error {
  protected errorCode: string = errorCodes[RouterUnauthorizedError.name];
  constructor(
    message: string,
    public gatewayUrl: GatewayUrl,
    public src?: unknown,
  ) {
    super(message);
  }
}
