import { GatewayUrl, ChainId, Theme } from "@hypernetlabs/objects";
import HypernetWebIntegration, {
  IHypernetWebIntegration,
} from "@hypernetlabs/web-integration";

import Spinner from "./assets/loading-spinner";

const theme = new Theme(
  {
    primary: {
      main: "#00C3A9",
      light: "#00C3A9",
      dark: "#00C3A9",
    },
  },
  null,
);

const client: IHypernetWebIntegration = new HypernetWebIntegration(
  "http://localhost:5020",
  ChainId(1337),
  theme,
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

const getReady = () => {
  client
    .getReady()
    .map((coreProxy) => {
      Spinner.hide();
      client.webUIClient.payments
        .startOnboardingFlow({
          gatewayUrl: gatewayUrl,
          showInModal: true,
          renderGatewayApprovalContent: () =>
            "You are good to go now and purchase credits.",
          successButtonProps: {
            label: "Success",
            action: () => {
              console.log("Success action.");
            },
          },
        })
        .map(() => {
          Spinner.hide();
        })
        .mapErr((err) => {
          console.log("startOnboardingFlow error", err);
        });
    })
    .mapErr((err) => {
      console.log("getReady error", err);
    });
};

const button = document.createElement("button");
button.innerHTML = "init";
button.onclick = getReady;
document.body.appendChild(button);
