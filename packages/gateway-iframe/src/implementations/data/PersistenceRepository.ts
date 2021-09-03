import { GatewayUrl } from "@hypernetlabs/objects";
import { ILocalStorageUtils } from "@hypernetlabs/utils";

import { IPersistenceRepository } from "@gateway-iframe/interfaces/data";
import { ExpectedRedirect } from "@gateway-iframe/interfaces/objects";
export class PersistenceRepository implements IPersistenceRepository {
  protected activatedGatewaySignaturesKey = "activatedGatewaySignatures";
  protected expectedRedirectKey = "expectedRedirect";

  constructor(protected localStorageUtils: ILocalStorageUtils) {}

  public getActivatedGatewaySignatures(): string[] {
    // Grab the list of activated gateway signatures from storage
    const activatedSignatureJson = this.localStorageUtils.getSessionItem(
      this.activatedGatewaySignaturesKey,
    );

    if (activatedSignatureJson == null) {
      return [];
    }

    return JSON.parse(activatedSignatureJson);
  }

  public addActivatedGatewaySignature(signature: string): void {
    const activatedSignatureJson = this.localStorageUtils.getSessionItem(
      this.activatedGatewaySignaturesKey,
    );

    let activatedSignatures: string[];
    if (activatedSignatureJson == null) {
      activatedSignatures = [];
    } else {
      activatedSignatures = JSON.parse(activatedSignatureJson);
    }

    activatedSignatures.push(signature);

    this.localStorageUtils.setSessionItem(
      this.activatedGatewaySignaturesKey,
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
      redirect.gatewayUrl as GatewayUrl,
      redirect.redirectParam,
      redirect.paramValue,
    );
  }
}
