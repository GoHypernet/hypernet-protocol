import {
  Signature,
  MerchantUrl,
  MerchantValidationError,
} from "@hypernetlabs/objects";
import { MerchantContext } from "@merchant-iframe/interfaces/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import { IContextProvider } from "@merchant-iframe/interfaces/utils";

@injectable()
export class ContextProvider implements IContextProvider {
  protected context: MerchantContext;
  protected connectorValidatedResolve: (() => void) | undefined;
  protected connectorValidatedReject: ((e: unknown) => void) | undefined;

  constructor(merchantUrl: MerchantUrl) {
    const connectorValidatedPromise = new Promise<void>((resolve, reject) => {
      this.connectorValidatedResolve = resolve;
      this.connectorValidatedReject = reject;
    });
    this.context = new MerchantContext(
      merchantUrl,
      new Subject(),
      new Subject(),
      null,
      null,
      null,
      null, // Public Identifier
      ResultAsync.fromPromise(
        connectorValidatedPromise,
        (e) => e as MerchantValidationError,
      ),
    );
  }

  public getMerchantContext(): MerchantContext {
    return this.context;
  }

  public setMerchantContext(context: MerchantContext): void {
    this.context = context;
  }

  public setValidatedMerchantConnector(
    validatedMerchantCode: string,
    validatedMerchantSignature: Signature,
  ): void {
    this.context.validatedMerchantCode = validatedMerchantCode;
    this.context.validatedMerchantSignature = validatedMerchantSignature;

    if (this.connectorValidatedResolve == null) {
      throw new Error(
        "Connector validated promise is null, this should never happen!",
      );
    }
    this.connectorValidatedResolve();
  }

  public setValidatedMerchantConnectorFailed(e: Error): void {
    if (this.connectorValidatedReject == null) {
      throw new Error(
        "Connector validated promise is null, this should never happen!",
      );
    }
    this.connectorValidatedReject(e);
  }
}
