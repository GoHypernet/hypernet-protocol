import { GatewayUrl, ChainId } from "@hypernetlabs/objects";
import HypernetWebIntegration, {
  IHypernetWebIntegration,
} from "@hypernetlabs/web-integration";

import Spinner from "./assets/loading-spinner";

const client: IHypernetWebIntegration = new HypernetWebIntegration(
  "http://localhost:5020",
  ChainId(1337),
  true,
  false,
  null,
);

// set image background styles
const style = document.createElement("style");
style.innerHTML = `body {
  background-image: url(https://storage.googleapis.com/hypernetlabs-public-assets/hypernet-protocol/galileo-dashboard-mock.png);
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #F9F9F9;
}`;

// Get the first script tag
const ref = document.querySelector("script");
ref?.parentNode?.insertBefore(style, ref);

Spinner();
// Spinner.show();

const gatewayUrl = GatewayUrl("http://localhost:3000/users/v0");

client
  .getReady()
  .map((coreProxy) => {
    Spinner.hide();
    client.webUIClient.payments
      .startOnboardingFlow({
        gatewayUrl: gatewayUrl,
        finalSuccessContent:
          'You are good to go now and purchase credits from <a href="http://localhost:9000/settings/credits">here</a>',
        showInModal: true,
        excludeCardWrapper: true,
      })
      .map(() => {
        Spinner.hide();
      })
      .mapErr((err) => {
        console.log("startOnboardingFlow errerrerr", err);
      });
  })
  .mapErr((err) => {
    console.log("getReady errerrerr", err);
  });
