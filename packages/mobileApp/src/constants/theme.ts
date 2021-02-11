import { DefaultTheme } from "@react-navigation/native";

export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};

export const appBackgroundGradientColors = ["#262F3F", "#1B202A"];