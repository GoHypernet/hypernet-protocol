import {
  HypernetLink,
  VectorError,
  InvalidParametersError,
  BlockchainUnavailableError,
  InvalidPaymentError,
  InvalidPaymentIdError,
} from "@hypernetlabs/objects";
import { ILinkService } from "@interfaces/business";
import { ILinkRepository } from "@interfaces/data";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

injectable();
export class LinkService implements ILinkService {
  constructor(protected linkRepository: ILinkRepository) {}

  /**
   *
   */
  public getLinks(): ResultAsync<
    HypernetLink[],
    | InvalidPaymentError
    | InvalidParametersError
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentIdError
  > {
    return this.linkRepository.getHypernetLinks();
  }
}
