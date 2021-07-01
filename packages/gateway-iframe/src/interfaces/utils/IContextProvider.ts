import { Signature } from "@hypernetlabs/objects";
import { GatewayContext } from "@gateway-iframe/interfaces/objects";

export interface IContextProvider {
  getGatewayContext(): GatewayContext;
  setGatewayContext(context: GatewayContext): void;
  setValidatedGatewayConnector(
    validatedGatewayCode: string,
    validatedGatewaySignature: Signature,
  ): void;
  setValidatedGatewayConnectorFailed(e: Error): void;
}

export const IContextProviderType = Symbol.for("IContextProvider");
