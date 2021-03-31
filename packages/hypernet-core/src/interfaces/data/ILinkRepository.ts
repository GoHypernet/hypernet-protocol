import { HypernetLink } from "@hypernetlabs/objects";
import {
  CoreUninitializedError,
  RouterChannelUnknownError,
  VectorError,
  InvalidParametersError,
  BlockchainUnavailableError,
  InvalidPaymentError,
  LogicalError,
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
    | RouterChannelUnknownError
    | CoreUninitializedError
    | VectorError
    | InvalidParametersError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | LogicalError
  >;

  /**
   * Given a linkId, return the associated Hypernet Link.
   * @param linkId The ID of the link to retrieve
   */
  getHypernetLink(
    linkId: string,
  ): ResultAsync<
    HypernetLink,
    | RouterChannelUnknownError
    | CoreUninitializedError
    | VectorError
    | InvalidParametersError
    | BlockchainUnavailableError
    | InvalidPaymentError
    | LogicalError
  >;
}
