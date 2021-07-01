import { Signature } from "@hypernetlabs/objects";
import { ExpectedRedirect } from "@gateway-iframe/interfaces/objects";

export interface IPersistenceRepository {
  getActivatedGatewaySignatures(): string[];
  addActivatedGatewaySignature(signature: Signature): void;
  setExpectedRedirect(redirect: ExpectedRedirect): void;
  getExpectedRedirect(): ExpectedRedirect | null;
}

export const IPersistenceRepositoryType = Symbol.for("IPersistenceRepository");
