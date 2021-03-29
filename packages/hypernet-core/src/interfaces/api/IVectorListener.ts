import { ResultAsync } from "neverthrow";
import {
  VectorError,
  CoreUninitializedError,
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
    | CoreUninitializedError
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
