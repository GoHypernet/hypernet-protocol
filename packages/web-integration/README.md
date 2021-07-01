![alt](documentation/images/Hypernet_Logo.jpg)

# Web integration

This is the package that merchants would include on their actual website if they want to support HNP. This package will instantiate HNC in an iframe and provides a proxy interface to it for the gateway to interface with; from the gateway's POV it should be like working directly with a HypernetCore object. It also provides a number of pre-built UI widgets, along with easy utility functions, that make it trivial to display information from HNC on the gateway's website.

## Get started

### Installation

install via yarn
`yarn add @hypernetlabs/web-integration`

install via npm
`npm install @hypernetlabs/web-integration`

### How to integrate

calling getReady would be enough to initialize the core but in order to get the user onboarded and be able to use his crypto in payments you need to call startOnboardingFlow in webUIClient which will open hypernet protocol UI modal built in with react.

Here is the full implementation of that:

```
import HypernetWebIntegration from "@hypernetlabs/web-integration";

const integration = new HypernetWebIntegration();


integration.getReady().map((coreProxy) => {
    integration.webUIClient.startOnboardingFlow({
        gatewayUrl: gatewayUrl,
        finalSuccessContent: 'Awesome, you can buy credits with your crypto now!',
        showInModal: true,
    }).mapErr((err) => {
      console.log("startOnboardingFlow error", err);
    });
}).mapErr((err) => {
  console.log("getReady error", err);
});
```

The onBoardingFlow diagram is like below:

![alt](documentation/images/OnboardingFlow.png)
