import {
  IHypernetCore,
  GatewayUrl,
  IUIData,
  ActiveStateChannel,
} from "@hypernetlabs/objects";
import HypernetWebUI, { IHypernetWebUI } from "@hypernetlabs/web-ui";
import { ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import HypernetIFrameProxy from "@web-integration/implementations/proxy/HypernetIFrameProxy";
import { IHypernetWebIntegration } from "@web-integration/interfaces/app/IHypernetWebIntegration";

export default class HypernetWebIntegration implements IHypernetWebIntegration {
  private static instance: IHypernetWebIntegration;
  protected iframeURL = "http://localhost:5020";
  protected governanceChainId = 1337;
  protected debug = false;
  protected currentGatewayUrl: GatewayUrl | undefined | null;
  protected getReadyTimeout: number = 15 * 1000;
  protected getReadyResult: ResultAsync<IHypernetCore, Error> | undefined;
  protected getReadyResolved = false;
  protected selectedStateChannel: ActiveStateChannel = {} as ActiveStateChannel;

  public webUIClient: IHypernetWebUI;
  public core: HypernetIFrameProxy;
  public UIData: IUIData;

  constructor(
    iframeURL: string | null,
    governanceChainId: number | null,
    governanceRequired: boolean | null,
    paymentsRequired: boolean | null,
    debug: boolean | null,
  ) {
    let iframeURLWithSearchParams = new URL(iframeURL || this.iframeURL);

    if (governanceChainId != null) {
      iframeURLWithSearchParams.searchParams.append(
        "governanceChainId",
        governanceChainId.toString(),
      );
    }

    if (governanceRequired != null) {
      iframeURLWithSearchParams.searchParams.append(
        "governanceRequired",
        governanceRequired.toString(),
      );
    }

    if (paymentsRequired != null) {
      iframeURLWithSearchParams.searchParams.append(
        "paymentsRequired",
        paymentsRequired.toString(),
      );
    }

    if (debug != null) {
      iframeURLWithSearchParams.searchParams.append("debug", debug.toString());
    }
    this.iframeURL = iframeURLWithSearchParams.toString();
    this.debug = debug || this.debug;
    this.governanceChainId = governanceChainId || this.governanceChainId;

    // Create a proxy connection to the iframe
    this.core = new HypernetIFrameProxy(
      this._prepareIFrameContainer(),
      this.iframeURL,
      "hypernet-core-iframe",
    );

    this.UIData = {
      onSelectedStateChannelChanged: new Subject<ActiveStateChannel>(),
      onVotesDelegated: new Subject<void>(),
      getSelectedStateChannel: () => this.selectedStateChannel,
    };

    this.UIData.onSelectedStateChannelChanged.subscribe((stateChannel) => {
      this.selectedStateChannel = stateChannel;
    });

    if (window.hypernetWebUIInstance) {
      this.webUIClient = window.hypernetWebUIInstance as IHypernetWebUI;
    } else {
      this.webUIClient = new HypernetWebUI(
        this.core,
        this.UIData,
        this.iframeURL,
        this.governanceChainId,
        this.debug,
      );
    }

    this.core.onGatewayIFrameDisplayRequested.subscribe((gatewayUrl) => {
      this.currentGatewayUrl = gatewayUrl;
    });

    this.core.onPrivateCredentialsRequested.subscribe(() => {
      //this.webUIClient.renderPrivateKeysModal();
      this.webUIClient.renderMetamaskWarningModal();
    });

    this.core.onWalletConnectOptionsDisplayRequested.subscribe(() => {
      this.webUIClient.renderWalletConnectWidget({ showInModal: true });
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
      .andThen(() => this.core.initialize())
      .map(() => {
        // This is for web ui to use if there is no core instance passed in web ui constructor
        window.hypernetCoreInstance = this.core;
        this.getReadyResolved = true;
        return this.core;
      })
      .mapErr((err) => {
        this.getReadyResolved = true;
        this.webUIClient.renderWarningAlertModal(
          `an error occurred during initialization of hypernet core${
            err?.message ? `: ${err?.message}` : "."
          }`,
        );
        return new Error("Something went wrong!");
      });

    return this.getReadyResult;
  }

  public displayGatewayIFrame(gatewayUrl: GatewayUrl): void {
    this.core.displayGatewayIFrame(gatewayUrl);
  }

  public closeGatewayIFrame(gatewayUrl: GatewayUrl): void {
    this.core.closeGatewayIFrame(gatewayUrl);
  }

  private _prepareIFrameContainer(): HTMLElement {
    // Create a container element for the iframe proxy
    const iframeContainer = document.createElement("div");
    iframeContainer.id = "__hypernet-protocol-iframe-container__";

    // Add close modal icon to iframe container
    const closeButton = document.createElement("div");
    closeButton.id = "__hypernet-protocol-iframe-close-icon__";
    closeButton.innerHTML = `
      <img id="__hypernet-protocol-iframe-close-img__" src="https://storage.googleapis.com/hypernetlabs-public-assets/hypernet-protocol/Close-big.png" width="20" />
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
          position: fixed;
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
        if (this.currentGatewayUrl != null) {
          this.core.closeGatewayIFrame(this.currentGatewayUrl);
          this.currentGatewayUrl = null;
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
