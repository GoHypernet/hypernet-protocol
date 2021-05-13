import { Signature } from "@hypernetlabs/objects";

import { ExpectedRedirect } from "@merchant-iframe/interfaces/objects";

export interface IPersistenceRepository {
  getActivatedMerchantSignatures(): string[];
  addActivatedMerchantSignature(signature: Signature): void;
  setExpectedRedirect(redirect: ExpectedRedirect): void;
  getExpectedRedirect(): ExpectedRedirect | null;
}

export const IPersistenceRepositoryType = Symbol.for("IPersistenceRepository");
