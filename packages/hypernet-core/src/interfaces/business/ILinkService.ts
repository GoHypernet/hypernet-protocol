import { NodeError } from "@connext/vector-types";
import { HypernetLink, ResultAsync } from "@interfaces/objects";
import { CoreUninitializedError, RouterChannelUnknownError } from "@interfaces/objects/errors";

export interface ILinkService {
  /**
   *
   */
  getLinks(): ResultAsync<HypernetLink[], RouterChannelUnknownError | CoreUninitializedError | NodeError | Error>;
}
