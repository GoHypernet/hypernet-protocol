import React from "react";
import Router from "../Router";
import LinearGradient from "react-native-linear-gradient";
import { StoreProvider } from "@mobileApp/state/store";
import { appBackgroundGradientColors } from "@mobileApp/constants/theme";
import WebViewBridge from "@mobileApp/components/WebViewBridge";

interface AppContainerProps {}

const AppContainer: React.FC<AppContainerProps> = (props: AppContainerProps) => {
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
