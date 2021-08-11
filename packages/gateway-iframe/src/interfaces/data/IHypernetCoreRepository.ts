import {
  IAuthorizeFundsRequest,
  IResolveInsuranceRequest,
  ISendFundsRequest,
} from "@hypernetlabs/gateway-connector";
import { ChainId, UUID, PublicIdentifier } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IHypernetCoreRepository {
  emitSendFundsRequest(request: ISendFundsRequest): ResultAsync<void, never>;

  emitAuthorizeFundsRequest(
    request: IAuthorizeFundsRequest,
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
}

export const IHypernetCoreRepositoryType = Symbol.for(
  "IHypernetCoreRepository",
);
