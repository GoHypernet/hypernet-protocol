import { MerchantUrl } from "@hypernetlabs/objects";
import { ILocalStorageUtils } from "@hypernetlabs/utils";
import { IPersistenceRepository } from "@merchant-iframe/interfaces/data";
import { ExpectedRedirect } from "@merchant-iframe/interfaces/objects";
export class PersistenceRepository implements IPersistenceRepository {
  protected activatedMerchantSignaturesKey = "activatedMerchantSignatures";
  protected expectedRedirectKey = "expectedRedirect";

  constructor(protected localStorageUtils: ILocalStorageUtils) {}

  public getActivatedMerchantSignatures(): string[] {
    // Grab the list of activated merchant signatures from storage
    const activatedSignatureJson = this.localStorageUtils.getSessionItem(
      this.activatedMerchantSignaturesKey,
    );

    if (activatedSignatureJson == null) {
      return [];
    }

    return JSON.parse(activatedSignatureJson);
  }

  public addActivatedMerchantSignature(signature: string): void {
    const activatedSignatureJson = this.localStorageUtils.getSessionItem(
      this.activatedMerchantSignaturesKey,
    );

    let activatedSignatures: string[];
    if (activatedSignatureJson == null) {
      activatedSignatures = [];
    } else {
      activatedSignatures = JSON.parse(activatedSignatureJson);
    }

    activatedSignatures.push(signature);

    this.localStorageUtils.setSessionItem(
      this.activatedMerchantSignaturesKey,
      JSON.stringify(activatedSignatures),
    );
  }

  public setExpectedRedirect(redirect: ExpectedRedirect): void {
    this.localStorageUtils.setSessionItem(
      this.expectedRedirectKey,
      JSON.stringify(redirect),
    );
  }
  public getExpectedRedirect(): ExpectedRedirect | null {
    const redirectStr = this.localStorageUtils.getSessionItem(
      this.expectedRedirectKey,
    );

    if (redirectStr == null) {
      return null;
    }

    const redirect = JSON.parse(redirectStr);

    return new ExpectedRedirect(
      redirect.merchantUrl as MerchantUrl,
      redirect.redirectParam,
      redirect.paramValue,
    );
  }
}
