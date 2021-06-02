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
import { ResultAsync } from "neverthrow";

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
