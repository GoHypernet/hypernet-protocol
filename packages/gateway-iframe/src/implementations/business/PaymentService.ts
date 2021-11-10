import {
  ISignedSendFundsRequest,
  ISignedAuthorizeFundsRequest,
  IResolveInsuranceRequest,
  IInitiateSendFundsRequest,
  IInitiateAuthorizeFundsRequest,
} from "@hypernetlabs/gateway-connector";
import {
  EPaymentType,
  PaymentId,
  PullPayment,
  PushPayment,
} from "@hypernetlabs/objects";
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
    (err: unknown | null, paymentId: PaymentId | null) => void
  >();
  protected initiateAuthorizeFundsCallbacks = new Map<
    string,
    (err: unknown | null, paymentId: PaymentId | null) => void
  >();
  protected getPaymentCallbacks = new Map<
    PaymentId,
    (
      payment: PushPayment | PullPayment | null,
      paymentType: EPaymentType,
    ) => void
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
      callback(null, paymentId);
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
      callback(null, paymentId);
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

  public getPayment(
    paymentId: PaymentId,
    callback: (
      payment: PushPayment | PullPayment | null,
      paymentType: EPaymentType,
    ) => void,
  ): ResultAsync<void, never> {
    this.getPaymentCallbacks.set(paymentId, callback);

    return this.hypernetCoreRepository.emitGetPayment(paymentId);
  }

  public paymentReceived(
    paymentId: PaymentId,
    payment: PushPayment | PullPayment | null,
    paymentType: EPaymentType,
  ): ResultAsync<void, never> {
    // We have a signature for a message, find the callback
    const callback = this.getPaymentCallbacks.get(paymentId);
    this.getPaymentCallbacks.delete(paymentId);

    if (callback != null) {
      callback(payment, paymentType);
    }

    return okAsync(undefined);
  }
}
