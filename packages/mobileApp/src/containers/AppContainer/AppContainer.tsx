import React from "react";
import Router from "../Router";
import { StoreProvider } from "@mobileApp/state/store";
import WebViewBridge from "@mobileApp/components/WebViewBridge";

interface AppContainerProps {}

const AppContainer: React.FC<AppContainerProps> = (props: AppContainerProps) => {
  return (
    <StoreProvider>
      <WebViewBridge />
      <Router initialRouteName="Splash" />
    </StoreProvider>
  );
};

export default AppContainer;
