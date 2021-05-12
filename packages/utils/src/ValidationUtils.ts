import { isValidPublicIdentifier } from "@connext/vector-utils";
import { utils } from "ethers";
import { injectable } from "inversify";

import { IValidationUtils } from "@utils/IValidationUtils";

@injectable()
export class ValidationUtils implements IValidationUtils {
  public validatePublicIdentifier(publicIdentifier: string): boolean {
    return isValidPublicIdentifier(publicIdentifier);
  }

  public validateEthereumAddress(ethereumAddress: string): boolean {
    return utils.isAddress(ethereumAddress);
  }

  public validateWeiAmount(amount: string): boolean {
    try {
      utils.parseUnits(amount, "wei");
      return true;
    } catch {
      return false;
    }
  }
}
