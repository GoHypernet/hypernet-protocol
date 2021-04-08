import HypernetWebIntegration, { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import { MerchantUrl } from "@hypernetlabs/objects";
import Spinner from "./assets/loading-spinner";

const client: IHypernetWebIntegration = new HypernetWebIntegration();

// set image background styles
var style = document.createElement("style");
style.innerHTML = `body {
  background-image: url(https://res.cloudinary.com/dqueufbs7/image/upload/v1614731973/images/image.png);
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #F9F9F9;
}`;

// Get the first script tag
var ref = document.querySelector("script");
ref?.parentNode?.insertBefore(style, ref);

Spinner();
Spinner.show();
client.getReady().map(() => {
  Spinner.hide();
  client.renderConnectorAuthorizationFlow({
    connectorUrl: MerchantUrl("http://localhost:8080/hypernet_protocol/v0"),
    showInModal: true,
  });
});
