import { Signature } from "@hypernetlabs/objects";
import { MerchantContext } from "@merchant-iframe/interfaces/objects";

export interface IContextProvider {
  getMerchantContext(): MerchantContext;
  setMerchantContext(context: MerchantContext): void;
  setValidatedMerchantConnector(
    validatedMerchantCode: string,
    validatedMerchantSignature: Signature,
  ): void;
  setValidatedMerchantConnectorFailed(e: Error): void;
}

export const IContextProviderType = Symbol.for("IContextProvider");
