import { LogUtils } from "@hypernetlabs/utils";
import { Box, ThemeProvider } from "@material-ui/core";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { useStyles } from "./App.style";

import Header from "@governance-app/components/Header";
import Router from "@governance-app/containers/Router";
import { useLayoutContext, StoreProvider } from "@governance-app/contexts";
import {
  ConfigProvider,
  GovernanceBlockchainProvider,
} from "@governance-app/implementations/utilities";
import {
  IConfigProvider,
  IGovernanceBlockchainProvider,
} from "@governance-app/interfaces/utilities";
import { lightTheme, darkTheme } from "@governance-app/theme";

const logUtils = new LogUtils();
const configProvider: IConfigProvider = new ConfigProvider(logUtils);
const governanceBlockchainProvider: IGovernanceBlockchainProvider =
  new GovernanceBlockchainProvider(configProvider, logUtils);

const App: React.FC = () => {
  const { theme } = useLayoutContext();
  const classes = useStyles();
  // TODO: move to context
  const [appReady, setAppReady] = useState<boolean>(true);

  return (
    <StoreProvider
      configProvider={configProvider}
      governanceBlockchainProvider={governanceBlockchainProvider}
    >
      <ThemeProvider theme={theme ? lightTheme : darkTheme}>
        <Box className={classes.appWrapper}>
          <BrowserRouter>
            <Header />
            {appReady && <Router />}
          </BrowserRouter>
        </Box>
      </ThemeProvider>
    </StoreProvider>
  );
};

export default App;
