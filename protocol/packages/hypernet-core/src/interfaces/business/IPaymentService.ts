import { Payment, BigNumber } from "@interfaces/objects";

export interface IPaymentService {
  sendPayment(channelId: string, amount: BigNumber): Promise<Payment>;
  requestPayment(channelId: string, amount: BigNumber): Promise<Payment>;
}
