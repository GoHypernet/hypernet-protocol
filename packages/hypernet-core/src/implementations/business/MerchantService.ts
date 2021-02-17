import { ResultUtils } from "@hypernetlabs/utils";
import { IMerchantService } from "@interfaces/business";
import { PublicKey, ResultAsync } from "@interfaces/objects";
import { CoreUninitializedError, MediatorValidationError, PersistenceError } from "@interfaces/objects/errors";
import { ethers } from "ethers";
// import crypto from "crypto";
import { errAsync, okAsync } from "neverthrow";
import { IBlockchainProvider } from "@interfaces/utilities";

export class MerchantService implements IMerchantService {
  constructor(protected blockchainProvider: IBlockchainProvider) {}

  public authorizeMerchant(
    merchantUrl: URL,
  ): ResultAsync<void, CoreUninitializedError | MediatorValidationError | PersistenceError> {
    // This is going to connect to the merchantUrl/connector and pull down the connector code.
    // That code is expected to be signed, with the public key available at merchantUrl/publicKey
    // The code will be cached in local storage but the signing key will be
    throw new Error("Unimplemented!");
    // return ResultUtils.combine([
    //   this.merchantConnectorRepository.getMerchantSignature(merchantUrl),
    //   this.merchantConnectorRepository.getMerchantPublicKey(merchantUrl),
    // ]).andThen((vals) => {
    //   const [myMediatorCode, signature, publicKey] = vals;
    //   mediatorCode = myMediatorCode;

    //   return this.validateMediator(mediatorCode, signature, publicKey);
    // });
    // .andThen(() => {
    //   // Mediator's code is validated, we need to get a signature from the user
    //   return this.blockchainProvider.getSigner();
    // })
    // .andThen((signer) => {
    //   return ResultAsync.fromPromise(signer.signMessage(merchantUrl), (e) => e as MediatorValidationError);
    // })
    // .andThen((signature) => {
    //   // User signed the mediator code, store the mediator into the repository
    //   return this.merchantConnectorRepository.addAuthorizedMediator(merchantUrl, signature);
    // })
    // .map(() => {

    // })
  }

  protected validateMediator(
    mediatorCode: string,
    mediatorSignature: string,
    publicKey: PublicKey,
  ): ResultAsync<void, MediatorValidationError> {
    const calculatedAddress = ethers.utils.verifyMessage(mediatorCode, mediatorSignature);
    const address = ethers.utils.computeAddress(publicKey);

    if (calculatedAddress !== address) {
      return errAsync(new MediatorValidationError("Mediator code does not match signature!"));
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
