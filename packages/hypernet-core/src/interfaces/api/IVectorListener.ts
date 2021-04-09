import { ResultAsync } from "neverthrow";
import {
  VectorError,
  BlockchainUnavailableError,
  LogicalError,
  InvalidPaymentIdError,
  PaymentFinalizeError,
  PaymentStakeError,
  TransferResolutionError,
  RouterChannelUnknownError,
  InvalidPaymentError,
  InvalidParametersError,
  TransferCreationError,
} from "@hypernetlabs/objects";

export interface IVectorListener {
  setup(): ResultAsync<
    void,
    | VectorError
    | BlockchainUnavailableError
    | LogicalError
    | InvalidPaymentIdError
    | PaymentFinalizeError
    | PaymentStakeError
    | TransferResolutionError
    | RouterChannelUnknownError
    | InvalidPaymentError
    | InvalidParametersError
    | TransferCreationError
  >;
}
