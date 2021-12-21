import {
  VectorError,
  BlockchainUnavailableError,
  InvalidPaymentIdError,
  PaymentFinalizeError,
  PaymentStakeError,
  TransferResolutionError,
  InvalidPaymentError,
  InvalidParametersError,
  TransferCreationError,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IVectorListener {
  initialize(): ResultAsync<
    void,
    | VectorError
    | BlockchainUnavailableError
    | InvalidPaymentIdError
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
  >;
}

export const IVectorListenerType = Symbol.for("IVectorListener");
