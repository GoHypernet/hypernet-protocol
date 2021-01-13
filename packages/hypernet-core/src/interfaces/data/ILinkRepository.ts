import { NodeError } from "@connext/vector-types";
import { HypernetLink, ResultAsync } from "@interfaces/objects";
import { CoreUninitializedError, RouterChannelUnknownError } from "@interfaces/objects/errors";

/**
 *
 */
export interface ILinkRepository {
  /**
   * Get all Hypernet Links for this client
   */
  getHypernetLinks(): ResultAsync<
    HypernetLink[],
    RouterChannelUnknownError | CoreUninitializedError | NodeError | Error
  >;

  /**
   * Given a linkId, return the associated Hypernet Link.
   * @param linkId The ID of the link to retrieve
   */
  getHypernetLink(
    linkId: string,
  ): ResultAsync<HypernetLink, RouterChannelUnknownError | CoreUninitializedError | NodeError | Error>;
}
