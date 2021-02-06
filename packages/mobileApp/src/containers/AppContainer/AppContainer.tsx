import React from "react";
import Router from "../Router";
import { StoreProvider } from "@mobileApp/state/store";
/* import { IHypernetCore, HypernetCore, EBlockchainNetwork } from "@hypernetlabs/hypernet-core";

// Instantiate the hypernet core.
const core: IHypernetCore = new HypernetCore(EBlockchainNetwork.Localhost);
console.log("core: ", core); */

interface AppContainerProps {}

const AppContainer: React.FC<AppContainerProps> = (props: AppContainerProps) => {
  return (
    <StoreProvider>
      <Router initialRouteName="MainHome" />
    </StoreProvider>
  );
};

export default AppContainer;
