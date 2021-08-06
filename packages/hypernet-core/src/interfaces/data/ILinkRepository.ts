import {
  HypernetLink,
  VectorError,
  InvalidParametersError,
  BlockchainUnavailableError,
  InvalidPaymentError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

/**
 *
 */
export interface ILinkRepository {
  /**
   * Get all Hypernet Links for this client
   */
  getHypernetLinks(): ResultAsync<
    HypernetLink[],
    | VectorError
    | InvalidParametersError
    | BlockchainUnavailableError
    | InvalidPaymentError
  >;

  /**
   * Given a linkId, return the associated Hypernet Link.
   * @param linkId The ID of the link to retrieve
   */
  getHypernetLink(
    linkId: string,
  ): ResultAsync<
    HypernetLink,
    | VectorError
    | InvalidParametersError
    | BlockchainUnavailableError
    | InvalidPaymentError
  >;
}

export const ILinkRepositoryType = Symbol.for("ILinkRepository");
