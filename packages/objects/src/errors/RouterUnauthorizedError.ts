import { GatewayUrl } from "@objects/GatewayUrl";

export class RouterUnauthorizedError extends Error {
  constructor(
    message: string,
    public gatewayUrl: GatewayUrl,
    public src?: unknown,
  ) {
    super(message);
  }
}
