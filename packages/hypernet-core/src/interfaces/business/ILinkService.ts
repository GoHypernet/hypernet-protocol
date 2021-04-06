import { ResultAsync } from "neverthrow";
import { HypernetLink } from "@hypernetlabs/objects";
import {
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
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
  >;
}
