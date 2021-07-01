import {
  Signature,
  GatewayUrl,
  GatewayValidationError,
} from "@hypernetlabs/objects";
import { GatewayContext } from "@gateway-iframe/interfaces/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import { IContextProvider } from "@gateway-iframe/interfaces/utils";

@injectable()
export class ContextProvider implements IContextProvider {
  protected context: GatewayContext;
  protected connectorValidatedResolve: (() => void) | undefined;
  protected connectorValidatedReject: ((e: unknown) => void) | undefined;

  constructor(gatewayUrl: GatewayUrl) {
    const connectorValidatedPromise = new Promise<void>((resolve, reject) => {
      this.connectorValidatedResolve = resolve;
      this.connectorValidatedReject = reject;
    });
    this.context = new GatewayContext(
      gatewayUrl,
      new Subject(),
      new Subject(),
      null,
      null,
      null,
      null, // Public Identifier
      ResultAsync.fromPromise(
        connectorValidatedPromise,
        (e) => e as GatewayValidationError,
      ),
    );
  }

  public getGatewayContext(): GatewayContext {
    return this.context;
  }

  public setGatewayContext(context: GatewayContext): void {
    this.context = context;
  }

  public setValidatedGatewayConnector(
    validatedGatewayCode: string,
    validatedGatewaySignature: Signature,
  ): void {
    this.context.validatedGatewayCode = validatedGatewayCode;
    this.context.validatedGatewaySignature = validatedGatewaySignature;

    if (this.connectorValidatedResolve == null) {
      throw new Error(
        "Connector validated promise is null, this should never happen!",
      );
    }
    this.connectorValidatedResolve();
  }

  public setValidatedGatewayConnectorFailed(e: Error): void {
    if (this.connectorValidatedReject == null) {
      throw new Error(
        "Connector validated promise is null, this should never happen!",
      );
    }
    this.connectorValidatedReject(e);
  }
}
