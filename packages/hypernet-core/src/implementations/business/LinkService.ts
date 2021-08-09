import {
  HypernetLink,
  VectorError,
  InvalidParametersError,
  BlockchainUnavailableError,
  InvalidPaymentError,
} from "@hypernetlabs/objects";
import { ILinkService } from "@interfaces/business";
import { ILinkRepository } from "@interfaces/data";
import { ResultAsync } from "neverthrow";

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
  > {
    throw new Error();
    // return this.linkRepository.getHypernetLinks();
  }
}
