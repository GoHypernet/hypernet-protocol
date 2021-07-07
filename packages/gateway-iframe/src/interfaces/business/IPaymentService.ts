import {
  ISendFundsRequest,
  IAuthorizeFundsRequest,
  IResolveInsuranceRequest,
} from "@hypernetlabs/gateway-connector";
import { ResultAsync } from "neverthrow";

export interface IPaymentService {
  sendFunds(request: ISendFundsRequest): ResultAsync<void, never>;
  authorizeFunds(request: IAuthorizeFundsRequest): ResultAsync<void, never>;
  resolveInsurance(request: IResolveInsuranceRequest): ResultAsync<void, Error>;
}

export const IPaymentServiceType = Symbol.for("IPaymentService");
