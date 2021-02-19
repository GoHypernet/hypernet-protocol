import { MerchantContext } from "../objects";

export interface IContextProvider {
  getMerchantContext(): MerchantContext;
  setMerchantContext(context: MerchantContext): void;
}
