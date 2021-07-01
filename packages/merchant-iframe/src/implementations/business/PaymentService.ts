import {
  ISendFundsRequest,
  IAuthorizeFundsRequest,
} from "@hypernetlabs/gateway-connector";
import { IPaymentService } from "@merchant-iframe/interfaces/business";
import {
  IHypernetCoreRepository,
  IHypernetCoreRepositoryType,
} from "@merchant-iframe/interfaces/data";
import { injectable, inject } from "inversify";
import { ResultAsync } from "neverthrow";

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
}
