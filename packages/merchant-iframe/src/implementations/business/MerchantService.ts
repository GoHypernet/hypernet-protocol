import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "@merchant-iframe/implementations/utils";
import { ethers } from "ethers";
import { IMerchantConnectorRepository } from "@merchant-iframe/interfaces/data";
import { PublicKey } from "@hypernetlabs/hypernet-core";
import { MerchantValidationError } from "@merchant-iframe/interfaces/objects/errors";

export class MerchantService {
  constructor(protected merchantConnectorRepository: IMerchantConnectorRepository) {}

  public authorizeMediator(merchantUrl: URL): ResultAsync<void, MerchantValidationError> {
    // This is going to connect to the merchantUrl/connector and pull down the connector code.
    // That code is expected to be signed, with the public key available at merchantUrl/publicKey
    // The code will be cached in local storage but the signing key will be
    let mediatorCode: string;

    return ResultUtils.combine([
      this.merchantConnectorRepository.getMerchantCode(merchantUrl),
      this.merchantConnectorRepository.getMerchantSignature(merchantUrl),
      this.merchantConnectorRepository.getMerchantPublicKey(merchantUrl),
    ]).andThen((vals) => {
      const [myMediatorCode, signature, publicKey] = vals;
      mediatorCode = myMediatorCode;

      return this.validateMediator(mediatorCode, signature, publicKey);
    });
  }

  protected validateMediator(
    mediatorCode: string,
    mediatorSignature: string,
    publicKey: PublicKey,
  ): ResultAsync<void, MerchantValidationError> {
    const calculatedAddress = ethers.utils.verifyMessage(mediatorCode, mediatorSignature);
    const address = ethers.utils.computeAddress(publicKey);

    if (calculatedAddress !== address) {
      return errAsync(new MerchantValidationError("Merchant code does not match signature!"));
    }

    return okAsync(undefined);

    // TODO: this uses the basic crypto library, based on https://stackoverflow.com/questions/56062691/how-to-verify-file-using-rsa-public-key
    // const verifier = crypto.createVerify("RSA-SHA256");
    // verifier.update(mediatorCode);
    // const testSignature = verifier.verify(publicKey, fileSignature, "base64");

    // if (!testSignature) {
    //     return errAsync(new MediatorValidationError("Mediator code does not match signature!"));
    // }

    // return okAsync(undefined);
  }
}
