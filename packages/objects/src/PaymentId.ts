import {Brand, make} from "ts-brand";

export type PaymentId = Brand<string, "PaymentId">;
export const PaymentId = make<PaymentId>();