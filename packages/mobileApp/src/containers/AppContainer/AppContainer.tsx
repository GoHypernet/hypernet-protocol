import React from "react";
import LinearGradient from "react-native-linear-gradient";

import Router from "../Router";

import WebViewBridge from "@mobileApp/components/WebViewBridge";
import { appBackgroundGradientColors } from "@mobileApp/constants/theme";
import { StoreProvider } from "@mobileApp/state/store";

interface AppContainerProps {}

const AppContainer: React.FC<AppContainerProps> = (
  props: AppContainerProps,
) => {
  return (
    <StoreProvider>
      <WebViewBridge />
      <LinearGradient
        colors={appBackgroundGradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <Router initialRouteName="Splash" />
      </LinearGradient>
    </StoreProvider>
  );
};

export default AppContainer;
