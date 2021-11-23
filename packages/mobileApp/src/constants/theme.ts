import { DefaultTheme } from "@react-navigation/native";

export const colors = {
  appBackground: "#111622",
  white: "#FFFFFF",
  borderBlue: "#2852ff",
  transparent: "transparent",
  inActiveGrey: "#6D778B",
  actionButtonBgColor: "#2E3546",
};

export const getNavigationTheme = (forSplashScreens?: boolean) => ({
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: forSplashScreens ? "transparent" : colors.appBackground,
  },
});

export const appBackgroundGradientColors = ["#262F3F", "#1B202A"];
