import {
  IAuthorizeFundsRequest,
  ISendFundsRequest,
} from "@hypernetlabs/merchant-connector";
import { IHypernetCoreRepository } from "@merchant-iframe/interfaces/data";
import { injectable, inject } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import Postmate from "postmate";

import {
  IContextProvider,
  IContextProviderType,
} from "@merchant-iframe/interfaces/utils";
import { IFrameHeight } from "@hypernetlabs/objects";

@injectable()
export class HypernetCoreRepository implements IHypernetCoreRepository {
  protected childApi: Postmate.ChildAPI | undefined;

  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {
    this.contextProvider
      .getMerchantContext()
      .onHypernetCoreProxyActivated.subscribe((childApi) => {
        this.childApi = childApi;
      });
  }

  public emitSendFundsRequest(
    request: ISendFundsRequest,
  ): ResultAsync<void, never> {
    this.childApi?.emit("sendFundsRequested", request);

    return okAsync(undefined);
  }

  public emitAuthorizeFundsRequest(
    request: IAuthorizeFundsRequest,
  ): ResultAsync<void, never> {
    this.childApi?.emit("authorizeFundsRequested", request);

    return okAsync(undefined);
  }

  public emitDisplayRequested(): ResultAsync<void, never> {
    const context = this.contextProvider.getMerchantContext();

    this.childApi?.emit("displayRequested", context.merchantUrl);

    return okAsync(undefined);
  }

  public emitCloseRequested(): ResultAsync<void, never> {
    const context = this.contextProvider.getMerchantContext();

    this.childApi?.emit("closeRequested", context.merchantUrl);

    return okAsync(undefined);
  }

  public emitSignMessageRequested(message: string): ResultAsync<void, never> {
    this.childApi?.emit("signMessageRequested", message);

    return okAsync(undefined);
  }

  public emitHeightUpdated(height: IFrameHeight): ResultAsync<void, never> {
    this.childApi?.emit("heightUpdated", height);

    return okAsync(undefined);
  }
}
