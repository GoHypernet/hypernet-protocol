import { EPaymentType } from "@interfaces/types";

export interface IPaymentUtils {
    isHypernetDomain(paymentId: string): Promise<boolean>;
    createPaymentId(paymentType: EPaymentType): Promise<string>;
}