/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ISignedAuthorizeFundsRequest,
  IResolveInsuranceRequest,
  ISignedSendFundsRequest,
} from "@hypernetlabs/gateway-connector";
import {
  AuthorizeFundsRequestData,
  ChainId,
  IStateChannelRequest,
  PaymentId,
  PublicIdentifier,
  SendFundsRequestData,
  UUID,
} from "@hypernetlabs/objects";
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

  public emitInitiateSendFundsRequest(
    request: SendFundsRequestData,
  ): ResultAsync<void, never> {
    // The request has a callback on it, we need to just clone the request and remove the callback
    const sendRequest = { ...request };
    delete (sendRequest as any).callback;

    this.childApi?.emit("initiateSendFundsRequested", sendRequest);

    return okAsync(undefined);
  }

  public emitSendFundsRequest(
    request: ISignedSendFundsRequest,
  ): ResultAsync<void, never> {
    // The request has a callback on it, we need to just clone the request and remove the callback
    const sendRequest = { ...request };
    delete (sendRequest as any).callback;

    this.childApi?.emit("sendFundsRequested", sendRequest);

    return okAsync(undefined);
  }

  public emitInitiateAuthorizeFundsRequest(
    request: AuthorizeFundsRequestData,
  ): ResultAsync<void, never> {
    // The request has a callback on it, we need to just clone the request and remove the callback
    const sendRequest = { ...request };
    delete (sendRequest as any).callback;

    this.childApi?.emit("initiateAuthorizeFundsRequested", sendRequest);

    return okAsync(undefined);
  }

  public emitAuthorizeFundsRequest(
    request: ISignedAuthorizeFundsRequest,
  ): ResultAsync<void, never> {
    // The request has a callback on it, we need to just clone the request and remove the callback
    const sendRequest = { ...request };
    delete (sendRequest as any).callback;
    this.childApi?.emit("authorizeFundsRequested", sendRequest);

    return okAsync(undefined);
  }

  public emitResolveInsuranceRequest(
    request: IResolveInsuranceRequest,
  ): ResultAsync<void, never> {
    this.childApi?.emit("resolveInsuranceRequested", request);

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

  public emitAssureStateChannel(
    id: UUID,
    chainId: ChainId,
    routerPublicIdentifiers: PublicIdentifier[],
  ): ResultAsync<void, never> {
    this.childApi?.emit("stateChannelRequested", {
      id,
      chainId,
      routerPublicIdentifiers,
    } as IStateChannelRequest);

    return okAsync(undefined);
  }

  public emitGetPayment(paymentId: PaymentId): ResultAsync<void, never> {
    this.childApi?.emit("getPaymentRequested", paymentId);

    return okAsync(undefined);
  }
}
