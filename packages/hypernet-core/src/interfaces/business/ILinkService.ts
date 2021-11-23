import {
  HypernetLink,
  VectorError,
  InvalidParametersError,
  BlockchainUnavailableError,
  InvalidPaymentError,
  InvalidPaymentIdError,
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
    | InvalidPaymentIdError
  >;
}

export const ILinkServiceType = Symbol.for("ILinkService");
