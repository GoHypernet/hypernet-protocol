import { IPaymentService } from "@interfaces/business";
import { Payment } from "@interfaces/objects";
import { BigNumber } from "ethers";

export class PaymentService implements IPaymentService {
    sendPayment(channelId: string, amount: BigNumber): Promise<Payment> {
        throw new Error("Method not implemented.");
    }
    requestPayment(channelId: string, amount: BigNumber): Promise<Payment> {
        throw new Error("Method not implemented.");
    }
}