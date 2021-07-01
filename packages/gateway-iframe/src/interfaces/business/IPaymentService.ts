import {
  ISendFundsRequest,
  IAuthorizeFundsRequest,
} from "@hypernetlabs/gateway-connector";
import { ResultAsync } from "neverthrow";

export interface IPaymentService {
  sendFunds(request: ISendFundsRequest): ResultAsync<void, never>;
  authorizeFunds(request: IAuthorizeFundsRequest): ResultAsync<void, never>;
}

export const IPaymentServiceType = Symbol.for("IPaymentService");
