import {
  ISignedSendFundsRequest,
  ISignedAuthorizeFundsRequest,
  IResolveInsuranceRequest,
  IInitiateSendFundsRequest,
  IInitiateAuthorizeFundsRequest,
} from "@hypernetlabs/gateway-connector";
import { PaymentId } from "@hypernetlabs/objects";
import { injectable, inject } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IPaymentService } from "@gateway-iframe/interfaces/business";
import {
  IHypernetCoreRepository,
  IHypernetCoreRepositoryType,
} from "@gateway-iframe/interfaces/data";

@injectable()
export class PaymentService implements IPaymentService {
  protected initiateSendFundsCallbacks = new Map<
    string,
    (paymentId: PaymentId) => void
  >();
  protected initiateAuthorizeFundsCallbacks = new Map<
    string,
    (paymentId: PaymentId) => void
  >();

  constructor(
    @inject(IHypernetCoreRepositoryType)
    protected hypernetCoreRepository: IHypernetCoreRepository,
  ) {}

  public initiateSendFunds(
    request: IInitiateSendFundsRequest,
  ): ResultAsync<void, never> {
    // Need to stash the callback so that when the answer is
    // transmitted back, we can call it.
    this.initiateSendFundsCallbacks.set(
      request.requestIdentifier,
      request.callback,
    );

    return this.hypernetCoreRepository.emitInitiateSendFundsRequest(request);
  }

  public sendFundsInitiated(
    requestId: string,
    paymentId: PaymentId,
  ): ResultAsync<void, never> {
    // We have a signature for a message, find the callback
    const callback = this.initiateSendFundsCallbacks.get(requestId);
    this.initiateSendFundsCallbacks.delete(requestId);

    if (callback != null) {
      callback(paymentId);
    }

    return okAsync(undefined);
  }

  public sendFunds(request: ISignedSendFundsRequest): ResultAsync<void, never> {
    return this.hypernetCoreRepository.emitSendFundsRequest(request);
  }

  public initiateAuthorizeFunds(
    request: IInitiateAuthorizeFundsRequest,
  ): ResultAsync<void, never> {
    // Need to stash the callback so that when the answer is
    // transmitted back, we can call it.
    this.initiateAuthorizeFundsCallbacks.set(
      request.requestIdentifier,
      request.callback,
    );

    return this.hypernetCoreRepository.emitInitiateAuthorizeFundsRequest(
      request,
    );
  }

  public authorizeFundsInitiated(
    requestId: string,
    paymentId: PaymentId,
  ): ResultAsync<void, never> {
    // We have a signature for a message, find the callback
    const callback = this.initiateAuthorizeFundsCallbacks.get(requestId);
    this.initiateAuthorizeFundsCallbacks.delete(requestId);

    if (callback != null) {
      callback(paymentId);
    }

    return okAsync(undefined);
  }

  public authorizeFunds(
    request: ISignedAuthorizeFundsRequest,
  ): ResultAsync<void, never> {
    return this.hypernetCoreRepository.emitAuthorizeFundsRequest(request);
  }

  public resolveInsurance(
    request: IResolveInsuranceRequest,
  ): ResultAsync<void, Error> {
    return this.hypernetCoreRepository.emitResolveInsuranceRequest(request);
  }
}
