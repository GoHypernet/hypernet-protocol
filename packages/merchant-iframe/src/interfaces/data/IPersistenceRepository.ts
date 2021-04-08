import { ExpectedRedirect } from "@merchant-iframe/interfaces/objects";
import { Signature } from "@hypernetlabs/objects";

export interface IPersistenceRepository {
  getActivatedMerchantSignatures(): string[];
  addActivatedMerchantSignature(signature: Signature): void;
  setExpectedRedirect(redirect: ExpectedRedirect): void;
  getExpectedRedirect(): ExpectedRedirect | null;
}
