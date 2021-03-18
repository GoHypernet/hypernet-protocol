import { ResultAsync } from "neverthrow";
import { HypernetLink } from "@hypernetlabs/objects";
import { CoreUninitializedError, RouterChannelUnknownError, VectorError } from "@hypernetlabs/objects/errors";

export interface ILinkService {
  /**
   *
   */
  getLinks(): ResultAsync<HypernetLink[], RouterChannelUnknownError | CoreUninitializedError | VectorError | Error>;
}
