import { ResultAsync } from "neverthrow";
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

export interface ILinkService {
  /**
   *
   */
  getLinks(): ResultAsync<
    HypernetLink[],
    | InvalidPaymentError
    | InvalidParametersError
    | RouterChannelUnknownError
    | CoreUninitializedError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
  >;
}
