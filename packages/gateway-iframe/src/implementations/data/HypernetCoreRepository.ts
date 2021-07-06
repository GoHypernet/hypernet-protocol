import {
  IAuthorizeFundsRequest,
  ISendFundsRequest,
} from "@hypernetlabs/gateway-connector";
import { injectable, inject } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import Postmate from "postmate";

import { IHypernetCoreRepository } from "@gateway-iframe/interfaces/data";
import {
  IContextProvider,
  IContextProviderType,
} from "@gateway-iframe/interfaces/utils";

@injectable()
export class HypernetCoreRepository implements IHypernetCoreRepository {
  protected childApi: Postmate.ChildAPI | undefined;

  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {
    this.contextProvider
      .getGatewayContext()
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
    const context = this.contextProvider.getGatewayContext();

    this.childApi?.emit("displayRequested", context.gatewayUrl);

    return okAsync(undefined);
  }

  public emitCloseRequested(): ResultAsync<void, never> {
    const context = this.contextProvider.getGatewayContext();

    this.childApi?.emit("closeRequested", context.gatewayUrl);

    return okAsync(undefined);
  }

  public emitSignMessageRequested(message: string): ResultAsync<void, never> {
    this.childApi?.emit("signMessageRequested", message);

    return okAsync(undefined);
  }
}
