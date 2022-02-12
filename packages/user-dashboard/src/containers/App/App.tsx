import HypernetWebIntegration, {
  ChainId,
  IHypernetCore,
  IHypernetWebIntegration,
} from "@hypernetlabs/web-integration";
import { ResultAsync } from "neverthrow";
import {
  ResultMessage,
  EResultStatus,
  lightTheme,
  darkTheme,
  ThemeProvider,
} from "@hypernetlabs/web-ui";
import { Box, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useStyles } from "./App.style";

import Header from "@user-dashboard/components/Header";
import Sidebar from "@user-dashboard/components/Sidebar";
import Router from "@user-dashboard/containers/Router";
import { useLayoutContext, StoreProvider } from "@user-dashboard/contexts";
import { ROUTES } from "@user-dashboard/containers/Router/Router.routes";

declare const __CORE_IFRAME_SOURCE__: string;
declare const __GOVERNANCE_CHAIN_ID__: string;

const integration: IHypernetWebIntegration = new HypernetWebIntegration(
  __CORE_IFRAME_SOURCE__,
  ChainId(parseInt(__GOVERNANCE_CHAIN_ID__)),
  null,
  null,
);

const App: React.FC = () => {
  const { setLoading, setResultMessage } = useLayoutContext();
  const classes = useStyles();
  const [coreReady, setCoreReady] = useState<boolean>(false);
  const theme = useTheme();
  const { pathname } = useLocation();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"), {
    noSsr: true,
  });

  useEffect(() => {
    setLoading(true);
    let readyResult: ResultAsync<IHypernetCore, Error>;

    if (pathname.includes(ROUTES.PAYMENTS)) {
      readyResult = integration.getPaymentsReady();
    } else if (
      pathname === ROUTES.ROOT ||
      pathname.includes(ROUTES.REGISTRIES) ||
      pathname.includes(ROUTES.LAZY_MINTING_REQUEST)
    ) {
      readyResult = integration.getRegistriesReady();
    } else if (
      pathname.includes(ROUTES.PROPOSALS) ||
      pathname.includes(ROUTES.PROPOSAL_CREATE)
    ) {
      readyResult = integration.getGovernanceReady();
    } else {
      readyResult = integration.getReady();
    }

    readyResult
      .map(() => {
        setLoading(false);
        setCoreReady(true);
      })
      .mapErr((e) => {
        setLoading(false);
        setResultMessage(
          new ResultMessage(
            EResultStatus.FAILURE,
            e.message || "Something went wrong!",
          ),
        );
      });
  }, [pathname]);

  return (
    <StoreProvider hypernetWebIntegration={integration}>
      <ThemeProvider theme={true ? lightTheme : darkTheme}>
        <Box className={classes.appWrapper}>
          <Header />
          <Box className={classes.bodyWrapper}>
            {isLargeScreen && <Sidebar />}
            {coreReady && <Router />}
          </Box>
        </Box>
      </ThemeProvider>
    </StoreProvider>
  );
};

export default App;
