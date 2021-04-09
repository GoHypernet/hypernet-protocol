import { ILinkService } from "@interfaces/business";
import { ILinkRepository } from "@interfaces/data";
import { HypernetLink } from "@hypernetlabs/objects";
import {
  RouterChannelUnknownError,
  VectorError,
  InvalidParametersError,
  BlockchainUnavailableError,
  InvalidPaymentError,
  LogicalError,
} from "@hypernetlabs/objects";
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
    | RouterChannelUnknownError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
  > {
    return this.linkRepository.getHypernetLinks();
  }
}
