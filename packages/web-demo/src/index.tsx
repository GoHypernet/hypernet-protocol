import { MerchantUrl } from "@hypernetlabs/objects";
import HypernetWebIntegration, {
  IHypernetWebIntegration,
} from "@hypernetlabs/web-integration";
import Spinner from "./assets/loading-spinner";
import { IHypernetWebUI } from "@hypernetlabs/web-ui";

const client: IHypernetWebIntegration = new HypernetWebIntegration();

// set image background styles
const style = document.createElement("style");
style.innerHTML = `body {
  background-image: url(https://res.cloudinary.com/dqueufbs7/image/upload/v1614731973/images/image.png);
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #F9F9F9;
}`;

// Get the first script tag
const ref = document.querySelector("script");
ref?.parentNode?.insertBefore(style, ref);

Spinner();
Spinner.show();

const merchantUrl = MerchantUrl("http://localhost:5010");

const renderConnectorAuthorizationFlow = (webUIClient: IHypernetWebUI) => {
  webUIClient
    .renderConnectorAuthorizationFlow({
      connectorUrl: merchantUrl,
      showInModal: true,
    })
    .map(() => {
      Spinner.hide();
    });
};

const renderFundWidget = (webUIClient: IHypernetWebUI) => {
  webUIClient
    .renderFundWidget({
      showInModal: true,
    })
    .map(() => {
      Spinner.hide();
    });
};

client.getReady().map((coreProxy) => {
  coreProxy.getAuthorizedMerchants().map((merchantsMap) => {
    if (merchantsMap.get(merchantUrl)) {
      renderFundWidget(client.webUIClient);
    } else {
      renderConnectorAuthorizationFlow(client.webUIClient);
    }
  });

  coreProxy.onMerchantAuthorized.subscribe((_merchantUrl) => {
    console.log("_merchantUrl: ", _merchantUrl);
    console.log("merchantUrl", merchantUrl);
    if (merchantUrl === _merchantUrl) {
      console.log("starttttt");
      renderFundWidget(client.webUIClient);
    }
  });
});
