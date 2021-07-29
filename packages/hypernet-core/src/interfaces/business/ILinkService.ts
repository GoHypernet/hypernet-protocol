import {
  HypernetLink,
  VectorError,
  InvalidParametersError,
  BlockchainUnavailableError,
  InvalidPaymentError,
  LogicalError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface ILinkService {
  /**
   *
   */
  getLinks(): ResultAsync<
    HypernetLink[],
    | InvalidPaymentError
    | InvalidParametersError
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
  >;
}

export const ILinkServiceType = Symbol.for("ILinkService");
