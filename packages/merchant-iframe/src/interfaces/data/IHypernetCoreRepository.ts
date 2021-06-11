import {
  IAuthorizeFundsRequest,
  ISendFundsRequest,
} from "@hypernetlabs/merchant-connector";
import { IFrameHeight } from "@hypernetlabs/objects";
import { ResultAsync } from "neverthrow";

export interface IHypernetCoreRepository {
  emitSendFundsRequest(request: ISendFundsRequest): ResultAsync<void, never>;

  emitAuthorizeFundsRequest(
    request: IAuthorizeFundsRequest,
  ): ResultAsync<void, never>;

  emitDisplayRequested(): ResultAsync<void, never>;

  emitCloseRequested(): ResultAsync<void, never>;

  emitSignMessageRequested(message: string): ResultAsync<void, never>;

  emitHeightUpdated(message: IFrameHeight): ResultAsync<void, never>;
}

export const IHypernetCoreRepositoryType = Symbol.for(
  "IHypernetCoreRepository",
);
