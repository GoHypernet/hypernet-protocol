export interface IValidationUtils {
  validatePublicIdentifier(publicIdentifier: string): boolean;
  validateEthereumAddress(ethereumAddress: string): boolean;
  validateWeiAmount(amount: string): boolean;
}

export const IValidationUtilsType = Symbol.for("IValidationUtils");
