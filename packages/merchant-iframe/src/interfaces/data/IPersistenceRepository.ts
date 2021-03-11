import { ExpectedRedirect } from "@merchant-iframe/interfaces/objects";

export interface IPersistenceRepository {
  getActivatedMerchantSignatures(): string[];
  addActivatedMerchantSignature(signature: string): void;
  setExpectedRedirect(redirect: ExpectedRedirect): void;
  getExpectedRedirect(): ExpectedRedirect | null;
}
