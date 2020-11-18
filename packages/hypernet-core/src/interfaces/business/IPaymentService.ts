import { Payment, BigNumber } from "@interfaces/objects";

/**
 * @todo What is the main role/purpose of this class? Description here.
 * @todo delete this entirely?
 */
export interface IPaymentService {
  sendPayment(channelId: string, amount: BigNumber): Promise<Payment>;
  requestPayment(channelId: string, amount: BigNumber): Promise<Payment>;
}
