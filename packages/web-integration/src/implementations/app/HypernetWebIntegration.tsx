import { IHypernetCore, MerchantUrl } from "@hypernetlabs/objects";
import HypernetWebUI, { IHypernetWebUI } from "@hypernetlabs/web-ui";
import { okAsync, ResultAsync } from "neverthrow";

import HypernetIFrameProxy from "@web-integration/implementations/proxy/HypernetIFrameProxy";
import { IHypernetWebIntegration } from "@web-integration/interfaces/app/IHypernetWebIntegration";
import { ILocalStorageUtils, LocalStorageUtils } from "@hypernetlabs/utils";

export default class HypernetWebIntegration implements IHypernetWebIntegration {
  private static instance: IHypernetWebIntegration;
  protected iframeURL = "http://localhost:5020"; // TODO: This should eventually be mainnet release
  protected currentMerchantUrl: MerchantUrl | undefined | null;
  protected getReadyTimeout: number = 15 * 1000;
  protected getReadyResult: ResultAsync<IHypernetCore, Error> | undefined;
  protected getReadyResolved = false;
  protected localStorageUtils: ILocalStorageUtils = new LocalStorageUtils();

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

    if (window.hypernetWebUIInstance) {
      this.webUIClient = window.hypernetWebUIInstance as IHypernetWebUI;
    } else {
      this.webUIClient = new HypernetWebUI(this.core);
    }

    this.core.onPrivateCredentialsRequested.subscribe(() => {
      //this.webUIClient.renderPrivateKeysModal();
      this.webUIClient.renderMetamaskWarningModal();
    });

    // Watch payments receive events and run accept automatically if autoAccept key is true
    this.core.onPushPaymentReceived.subscribe((payment) => {
      if (this._getPaymentsAutoAccept()) {
        this.core.acceptOffers([payment.id]);
      }
    });

    this.core.onPullPaymentReceived.subscribe((payment) => {
      if (this._getPaymentsAutoAccept()) {
        this.core.acceptOffers([payment.id]);
      }
    });
  }

  // wait for the core to be intialized
  public getReady(): ResultAsync<IHypernetCore, Error> {
    // Wait getReadyTimeout and show timeout guid if getReady hasn't resolved yet
    /* setTimeout(() => {
      if (this.getReadyResolved === false) {
        this.webUIClient.renderWarningAlertModal(
          "Timeout exceeded while initializing Hypernet Protocol!",
        );
      }
    }, this.getReadyTimeout); */

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
        this.getReadyResolved = true;
        return this.core;
      })
      .mapErr((err) => {
        this.getReadyResolved = true;
        this.webUIClient.renderWarningAlertModal(err?.message);
        return new Error("Something went wrong!");
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

  private _getPaymentsAutoAccept(): boolean {
    const autoAccept = this.localStorageUtils.getItem("PaymentsAutoAccept");

    if (autoAccept == null) {
      return false;
    }

    return JSON.parse(autoAccept);
  }

  private _prepareIFrameContainer(): HTMLElement {
    // Create a container element for the iframe proxy
    const iframeContainer = document.createElement("div");
    iframeContainer.id = "__hypernet-protocol-iframe-container__";

    // Add close modal icon to iframe container
    const closeButton = document.createElement("div");
    closeButton.id = "__hypernet-protocol-iframe-close-icon__";
    closeButton.innerHTML = `
      <img id="__hypernet-protocol-iframe-close-img__" src="https://res.cloudinary.com/dqueufbs7/image/upload/v1611371438/images/Close-512.png" width="20" />
    `;
    iframeContainer.appendChild(closeButton);

    // Add iframe modal style
    const style = document.createElement("style");
    style.appendChild(
      document.createTextNode(`
        iframe {
          position: absolute;
          display: none;
          border: none;
          width: 550px;
          height: 60%;
          min-height: 200px;
          background-color: white;
          top: 50%;
          left: 50%;
          box-shadow: 0px 4px 20px #000000;
          border-radius: 4px;
          transform: translate(-50%, -50%);
        }
        #__hypernet-protocol-iframe-container__ {
          position: absolute;
          display: none;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: rgba(0,0,0,0.6);
          z-index: 999999 !important;
        }
        #__hypernet-protocol-iframe-close-icon__ {
          z-index: 2;
          position: absolute;
          height: 60%;
          top: 50%;
          left: 50%;
          transform: translate(calc(-50% + 263px), -50%);
        }
        #__hypernet-protocol-iframe-close-img__{
          cursor: pointer;
        }
    `),
    );
    document.head.appendChild(style);

    // Attach everything to the body
    document.body.appendChild(iframeContainer);

    const closeImg = document.getElementById(
      "__hypernet-protocol-iframe-close-img__",
    );

    closeImg?.addEventListener(
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

    return iframeContainer;
  }
}

declare let window: any;

window.HypernetWebIntegration = HypernetWebIntegration;
