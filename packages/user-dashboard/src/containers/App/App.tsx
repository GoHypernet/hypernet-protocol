import HypernetWebIntegration, {
  ChainId,
  IHypernetWebIntegration,
} from "@hypernetlabs/web-integration";
import {
  ResultMessage,
  EResultStatus,
  lightTheme,
  darkTheme,
  ThemeProvider,
} from "@hypernetlabs/web-ui";
import { Box, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { useStyles } from "./App.style";

import Header from "@user-dashboard/components/Header";
import Sidebar from "@web-integration/components/Sidebar";
import Router from "@user-dashboard/containers/Router";
import { useLayoutContext, StoreProvider } from "@user-dashboard/contexts";

declare const __CORE_IFRAME_SOURCE__: string;
declare const __GOVERNANCE_CHAIN_ID__: string;

const integration: IHypernetWebIntegration = new HypernetWebIntegration(
  __CORE_IFRAME_SOURCE__,
  ChainId(parseInt(__GOVERNANCE_CHAIN_ID__)),
  null,
);

const App: React.FC = () => {
  const { setLoading, setResultMessage } = useLayoutContext();
  const classes = useStyles();
  const [coreReady, setCoreReady] = useState<boolean>(false);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"), {
    noSsr: true,
  });
  
  useEffect(() => {
    setLoading(true);

    integration
      .getReady()
      .map((coreProxy) => {
        setLoading(false);
        setCoreReady(true);
      })
      .mapErr((e) => {
        setResultMessage(
          new ResultMessage(
            EResultStatus.FAILURE,
            e.message || "Something went wrong!",
          ),
        );
      });
  }, []);

  return (
    <StoreProvider hypernetWebIntegration={integration}>
      <ThemeProvider theme={true ? lightTheme : darkTheme}>
        <Box className={classes.appWrapper}>
          <BrowserRouter>
            <Header />
            <Box className={classes.bodyWrapper}>
              {isLargeScreen && <Sidebar />}
              {coreReady && <Router />}
            </Box>
          </BrowserRouter>
        </Box>
      </ThemeProvider>
    </StoreProvider>
  );
};

export default App;
