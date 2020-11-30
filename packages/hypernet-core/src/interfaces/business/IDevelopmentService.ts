import { BigNumber } from "@interfaces/objects";

export interface IDevelopmentService {
  mintTestToken(amount: BigNumber): Promise<void>;
}
