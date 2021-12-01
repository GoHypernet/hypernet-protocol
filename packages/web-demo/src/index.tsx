import { GatewayUrl } from "@hypernetlabs/objects";
import HypernetWebIntegration, {
  IHypernetWebIntegration,
} from "@hypernetlabs/web-integration";

import Spinner from "./assets/loading-spinner";

const client: IHypernetWebIntegration = new HypernetWebIntegration(
  null,
  null,
  null,
);

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
// Spinner.show();

const gatewayUrl = GatewayUrl("http://localhost:3000/users/v0");

client
  .getReady()
  .map((coreProxy) => {
    client.webUIClient
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
