import { Signature } from "@objects/Signature";

export class AuthorizedMerchantSignature {
  constructor(public signature: Signature, 
    public activationStatus: boolean) {}
}
