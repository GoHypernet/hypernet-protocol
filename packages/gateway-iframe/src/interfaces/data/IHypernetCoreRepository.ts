import {
  ISignedAuthorizeFundsRequest,
  IResolveInsuranceRequest,
  ISignedSendFundsRequest,
} from "@hypernetlabs/gateway-connector";
import {
  ChainId,
  UUID,
  PublicIdentifier,
  AuthorizeFundsRequestData,
  SendFundsRequestData,
  PaymentId,
} from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IHypernetCoreRepository {
  emitInitiateSendFundsRequest(
    request: SendFundsRequestData,
  ): ResultAsync<void, never>;
  emitSendFundsRequest(
    request: ISignedSendFundsRequest,
  ): ResultAsync<void, never>;

  emitInitiateAuthorizeFundsRequest(
    request: AuthorizeFundsRequestData,
  ): ResultAsync<void, never>;
  emitAuthorizeFundsRequest(
    request: ISignedAuthorizeFundsRequest,
  ): ResultAsync<void, never>;

  emitResolveInsuranceRequest(
    request: IResolveInsuranceRequest,
  ): ResultAsync<void, never>;

  emitDisplayRequested(): ResultAsync<void, never>;

  emitCloseRequested(): ResultAsync<void, never>;

  emitSignMessageRequested(message: string): ResultAsync<void, never>;

  emitAssureStateChannel(
    id: UUID,
    chainId: ChainId,
    routerPublicIdentifiers: PublicIdentifier[],
  ): ResultAsync<void, never>;

  emitGetPayment(paymentId: PaymentId): ResultAsync<void, never>;
}

export const IHypernetCoreRepositoryType = Symbol.for(
  "IHypernetCoreRepository",
);
