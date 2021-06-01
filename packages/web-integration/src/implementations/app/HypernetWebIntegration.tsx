import { IHypernetCore, MerchantUrl } from "@hypernetlabs/objects";
import HypernetWebUI, { IHypernetWebUI } from "@hypernetlabs/web-ui";
import { ResultAsync } from "neverthrow";

import HypernetIFrameProxy from "@web-integration/implementations/proxy/HypernetIFrameProxy";
import { IHypernetWebIntegration } from "@web-integration/interfaces/app/IHypernetWebIntegration";

export default class HypernetWebIntegration implements IHypernetWebIntegration {
  private static instance: IHypernetWebIntegration;

  protected iframeURL = "http://localhost:8090";
  protected currentMerchantUrl: MerchantUrl | undefined | null;

  public webUIClient: IHypernetWebUI;

  public core: HypernetIFrameProxy;

  constructor(iframeURL?: string) {
    this.iframeURL = iframeURL || this.iframeURL;

    // Create a proxy connection to the iframe
    this.core = new HypernetIFrameProxy(
      this._prepareIFrameContainer(),
      this.iframeURL,
      "hypernet-core-iframe",
    );

    this.core.onMerchantIFrameDisplayRequested.subscribe((merchantUrl) => {
      this.currentMerchantUrl = merchantUrl;
    });

    // TODO: check this when dealing with core multiple instances issue
    if (window.hypernetWebUIInstance) {
      this.webUIClient = window.hypernetWebUIInstance as IHypernetWebUI;
    } else {
      this.webUIClient = new HypernetWebUI(this.core);
    }

    this.core.onPrivateCredentialsRequested.subscribe(() => {
      this.webUIClient.renderPrivateKeysModal();
    });
  }

  // wait for the core to be intialized
  protected getReadyResult: ResultAsync<IHypernetCore, Error> | undefined;
  public getReady(): ResultAsync<IHypernetCore, Error> {
    if (this.getReadyResult != null) {
      return this.getReadyResult;
    }
    this.getReadyResult = this.core
      .activate()
      .andThen(() => {
        return this.core.getEthereumAccounts();
      })
      .andThen((accounts) => this.core.initialize(accounts[0]))
      .map(() => {
        // This is for web ui to use if there is no core instance passed in web ui constructor
        window.hypernetCoreInstance = this.core;
        return this.core;
      });

    return this.getReadyResult;
  }

  // This class must be used as a singleton, this enforces that restriction.
  public static getInstance(): IHypernetWebIntegration {
    if (HypernetWebIntegration.instance == null) {
      HypernetWebIntegration.instance = new HypernetWebIntegration();
    }

    return HypernetWebIntegration.instance;
  }

  public displayMerchantIFrame(merchantUrl: MerchantUrl): void {
    this.core.displayMerchantIFrame(merchantUrl);
  }

  public closeMerchantIFrame(merchantUrl: MerchantUrl): void {
    this.core.closeMerchantIFrame(merchantUrl);
  }

  private _prepareIFrameContainer(): HTMLElement {
    // Create a container element for the iframe proxy
    const iframeContainer = document.createElement("div");
    iframeContainer.id = "__hypernet-protocol-iframe-container__";

    // Add close modal icon to iframe container
    const closeButton = document.createElement("div");
    closeButton.id = "__hypernet-protocol-iframe-close-icon__";
    closeButton.innerHTML = `
      <img src="https://res.cloudinary.com/dqueufbs7/image/upload/v1611371438/images/Close-512.png" width="20" />
    `;
    iframeContainer.appendChild(closeButton);

    closeButton.addEventListener(
      "click",
      (e) => {
        if (this.currentMerchantUrl != null) {
          this.core.closeMerchantIFrame(this.currentMerchantUrl);
          this.currentMerchantUrl = null;
        }
        iframeContainer.style.display = "none";
      },
      false,
    );

    // Add iframe modal style
    const style = document.createElement("style");
    style.appendChild(
      document.createTextNode(`
        iframe {
          position: absolute;
          display: none;
          border: none;
          width: 700px;
          height: 800px;
          min-height: 200px;
          background-color: white;
          top: 50%;
          left: 50%;
          box-shadow: 0px 4px 20px #000000;
          border-radius: 4px;
          transform: translate(-50%, -50%);
          padding: 15px;
        }
        #__hypernet-protocol-iframe-container__ {
          position: absolute;
          display: none;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: rgba(0,0,0,0.6);
        }
        #__hypernet-protocol-iframe-close-icon__ {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(calc(-50% + 335px), calc(-50% - 385px));
          z-index: 2;
          cursor: pointer;
        }
    `),
    );
    document.head.appendChild(style);

    // Attach everything to the body
    document.body.appendChild(iframeContainer);

    return iframeContainer;
  }
}

declare let window: any;

window.HypernetWebIntegration = HypernetWebIntegration;
