import {
  ISendFundsRequest,
  IAuthorizeFundsRequest,
  IResolveInsuranceRequest,
} from "@hypernetlabs/gateway-connector";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";

import { IPaymentService } from "@gateway-iframe/interfaces/business";
import {
  IHypernetCoreRepository,
  IHypernetCoreRepositoryType,
} from "@gateway-iframe/interfaces/data";

@injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @inject(IHypernetCoreRepositoryType)
    protected hypernetCoreRepository: IHypernetCoreRepository,
  ) {}
  public sendFunds(request: ISendFundsRequest): ResultAsync<void, never> {
    return this.hypernetCoreRepository.emitSendFundsRequest(request);
  }

  public authorizeFunds(
    request: IAuthorizeFundsRequest,
  ): ResultAsync<void, never> {
    return this.hypernetCoreRepository.emitAuthorizeFundsRequest(request);
  }

  public resolveInsurance(
    request: IResolveInsuranceRequest,
  ): ResultAsync<void, Error> {
    return this.hypernetCoreRepository.emitResolveInsuranceRequest(request);
  }
}
