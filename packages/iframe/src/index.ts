import { HypernetCore } from "@hypernetlabs/hypernet-core";
import { IHypernetCore } from "@hypernetlabs/objects";
import { EBlockchainNetwork } from "@hypernetlabs/objects";

import CoreWrapper from "./CoreWrapper";

// Instantiate the hypernet core.
const core: IHypernetCore = new HypernetCore(
  EBlockchainNetwork.Localhost,
  undefined,
);

const coreWrapper = new CoreWrapper(core);
coreWrapper.activateModel();

// Here is only where can access and manipulate core iframe dom and style
core.onDeStorageAuthenticationStarted.subscribe(() => {
  const content = document.createElement("div");
  content.id = "__hypernet-protocol-iframe-authentication-content__";
  content.innerHTML = `<h3>3ID Connect wants to authenticate: </h3>`;

  document.body.appendChild(content);
});

core.onDeStorageAuthenticationFailed.subscribe(() => {
  const content = document.createElement("div");
  content.id = "__hypernet-protocol-iframe-authentication-failuer-content__";
  content.innerHTML = `<h4>Something went wrong during authentication</h4>`;

  document.body.appendChild(content);
});

core.onDeStorageAuthenticationSucceeded.subscribe(() => {
  const content = document.createElement("div");
  content.innerHTML = `<h3>3ID Connect wants to authenticate: </h3>`;

  document
    .getElementById("__hypernet-protocol-iframe-authentication-content__")
    ?.remove();

  document
    .getElementById(
      "__hypernet-protocol-iframe-authentication-failuer-content__",
    )
    ?.remove();
});
