import {
  HypernetLink,
  VectorError,
  InvalidParametersError,
  BlockchainUnavailableError,
  InvalidPaymentError,
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
  >;
}

export const ILinkServiceType = Symbol.for("ILinkService");
