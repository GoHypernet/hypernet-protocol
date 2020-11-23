import { EPaymentType } from "@interfaces/types";
import { IConfigProvider, IPaymentUtils } from "@interfaces/utilities";
import { v4 as uuidv4 } from "uuid";

export class PaymentUtils implements IPaymentUtils {
    constructor(protected configProvider: IConfigProvider) {}
    
    public async isHypernetDomain(paymentId: string): Promise<boolean> {
        const config = await this.configProvider.getConfig();

        const paymentComponents = paymentId.split(":");

        return paymentComponents[0] == config.hypernetProtocolDomain;
    }
    
    public async createPaymentId(paymentType: EPaymentType): Promise<string> {
        const config = await this.configProvider.getConfig();

        return `${config.hypernetProtocolDomain}:${paymentType}:${uuidv4()}`;
    }
}