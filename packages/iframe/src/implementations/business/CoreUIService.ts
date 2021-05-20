import { okAsync, ResultAsync } from "neverthrow";

import { ICoreUIService } from "@core-iframe/interfaces/business";

export class CoreUIService implements ICoreUIService {
  protected authenticationContentId =
    "__hypernet-protocol-iframe-authentication-content__";
  protected authenticationFailureContentId =
    "__hypernet-protocol-iframe-authentication-failuer-content__";
  constructor() {}

  public renderDeStorageAuthenticationUI(): ResultAsync<void, never> {
    this._cleanUpAuthenticationContent();

    const content = document.createElement("div");
    content.id = this.authenticationContentId;
    content.innerHTML = `<h3>3ID Connect wants to authenticate: </h3>`;

    document.body.appendChild(content);
    return okAsync(undefined);
  }

  public renderDeStorageAuthenticationFailedUI(): ResultAsync<void, never> {
    this._cleanUpAuthenticationContent();

    const content = document.createElement("div");
    content.id = this.authenticationFailureContentId;
    content.innerHTML = `<h4>Something went wrong during authentication</h4>`;

    document.body.appendChild(content);
    return okAsync(undefined);
  }

  public renderDeStorageAuthenticationSucceededUI(): ResultAsync<void, never> {
    this._cleanUpAuthenticationContent();
    return okAsync(undefined);
  }

  private _cleanUpAuthenticationContent() {
    const prevElm = document.getElementById(this.authenticationContentId);
    //remove if there is already a previous 3id connect related content
    if (prevElm) {
      prevElm.remove();
    }

    const prevFailureElm = document.getElementById(
      this.authenticationFailureContentId,
    );
    //remove if there is already a previous 3id connect related failure content
    if (prevFailureElm) {
      prevFailureElm.remove();
    }
  }
}
