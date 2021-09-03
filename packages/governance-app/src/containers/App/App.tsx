import HypernetWebIntegration, {
  IHypernetWebIntegration,
} from "@hypernetlabs/web-integration";
import { Box, ThemeProvider } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

import { useStyles } from "./App.style";

import Header from "@governance-app/components/Header";
import Router from "@governance-app/containers/Router";
import { useLayoutContext, StoreProvider } from "@governance-app/contexts";
import { lightTheme, darkTheme } from "@governance-app/theme";

declare const __CORE_IFRAME_SOURCE__: string;

const integration: IHypernetWebIntegration = new HypernetWebIntegration(
  __CORE_IFRAME_SOURCE__,
);

const App: React.FC = () => {
  const { theme } = useLayoutContext();
  const classes = useStyles();

  return (
    <StoreProvider hypernetWebIntegration={integration}>
      <ThemeProvider theme={theme ? lightTheme : darkTheme}>
        <CssBaseline />
        <Box className={classes.appWrapper}>
          <BrowserRouter>
            <Header />
            <Router />
          </BrowserRouter>
        </Box>
      </ThemeProvider>
    </StoreProvider>
  );
};

export default App;
