# web-integration

This package provides an SDK that a Hypernet Protocol-enabled application, such as Galileo, would use on their website. This package creates a Postmate parent proxy for Hypernet Core, instantiating and connecting to the `iframe` package. This proxy implements the `IHypernetCore` interface and from an end-user standpoint should act functionally identical to having a proper `HypernetCore` instance. This package provides access to this proxy, but the vast majority of users will not need to use it. Instead, the package provides a number of pre-built UI widgets, along with easy utility functions, that make it trivial to display information from HNC.

In ordinary practice, an application such as Galileo that wants to display information (or retrieve it) about the user's Hypernet Protocol status, will include this package and make use of the UI widgets it provides, placing them on its own page. This package ONLY works for Single Page Applications (SPAs), as Hypernet Core takes some time to startup and establish itself. Applications built using older techniques with frequent reloads will NOT work with this package OR with Hypernet Protocol; it requires a long-running environment to be efficient. If you are trying to use HNP on such a site it is recommended to create a wrapper frame for your application that hosts the web-integration package, and put your legacy app inside an iframe in the wrapper or use AJAX techniques. Converting a legacy site to a SPA is beyond the scope of this documentation but IS possible.

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
