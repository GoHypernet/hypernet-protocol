import { MerchantContext } from "@merchant-iframe/interfaces/objects";
import { IContextProvider } from "@merchant-iframe/interfaces/utils";
import { ResultAsync } from "neverthrow";
import { IMerchantConnector } from "packages/merchant-connector/dist";
import { Signature, MerchantUrl } from "@hypernetlabs/objects";
import { Subject } from "rxjs";

export class ContextProvider implements IContextProvider {
  protected context: MerchantContext;
  protected connectorValidatedResolve: (() => void) | undefined;

  constructor(merchantUrl: MerchantUrl) {
    const connectorValidatedPromise = new Promise<void>((resolve) => {
      this.connectorValidatedResolve = resolve;
    });
    this.context = new MerchantContext(
      merchantUrl,
      new Subject<IMerchantConnector>(),
      null,
      null,
      null,
      null, // Public Identifier
      ResultAsync.fromSafePromise(connectorValidatedPromise),
    );
  }

  getMerchantContext(): MerchantContext {
    return this.context;
  }

  setMerchantContext(context: MerchantContext): void {
    this.context = context;
  }

  setValidatedMerchantConnector(validatedMerchantCode: string, validatedMerchantSignature: Signature): void {
    this.context.validatedMerchantCode = validatedMerchantCode;
    this.context.validatedMerchantSignature = validatedMerchantSignature;

    if (this.connectorValidatedResolve == null) {
      throw new Error("Connector validated promise is null, this should never happen!");
    }
    this.connectorValidatedResolve();
  }
}
