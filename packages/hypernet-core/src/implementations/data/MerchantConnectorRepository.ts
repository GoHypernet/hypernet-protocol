import { IMerchantConnectorRepository } from "@interfaces/data";
import { PublicKey } from "@interfaces/objects";
import { PersistenceError } from "@interfaces/objects/errors";
import { ResultAsync } from "neverthrow";

export class MerchantConnectorRepository implements IMerchantConnectorRepository {
  constructor() {}

  public getMerchantConnectorSignature(merchantUrl: URL): ResultAsync<string, Error> {
    throw new Error("Method not implemented.");
  }

  public getMerchantPublicKey(merchantUrl: URL): ResultAsync<PublicKey, Error> {
    throw new Error("Method not implemented.");
  }

  public addAuthorizedMediator(merchantUrl: URL, signature: string): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
}
