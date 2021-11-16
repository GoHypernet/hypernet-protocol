import {
  HypernetLink,
  VectorError,
  InvalidParametersError,
  BlockchainUnavailableError,
  InvalidPaymentError,
  PublicIdentifier,
  EthereumAddress,
  InvalidPaymentIdError,
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
    | InvalidPaymentIdError
  >;

  /**
   * Given a linkId, return the associated Hypernet Link.
   * @param linkId The ID of the link to retrieve
   */
  getHypernetLink(
    routerChannelAddress: EthereumAddress,
    counterpartyId: PublicIdentifier,
  ): ResultAsync<
    HypernetLink,
    | VectorError
    | InvalidParametersError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | InvalidPaymentIdError
  >;
}

export const ILinkRepositoryType = Symbol.for("ILinkRepository");
