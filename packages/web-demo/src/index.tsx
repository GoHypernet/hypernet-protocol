import { MerchantUrl } from "@hypernetlabs/objects";
import HypernetWebIntegration, {
  IHypernetWebIntegration,
} from "@hypernetlabs/web-integration";

import Spinner from "./assets/loading-spinner";

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

client.getReady().map((coreProxy) => {
  client.webUIClient
    .startOnboardingFlow({
      merchantUrl: merchantUrl,
      showInModal: true,
    })
    .map(() => {
      Spinner.hide();
    });
});
