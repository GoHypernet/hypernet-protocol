import { LogUtils } from "@hypernetlabs/utils";
import { Box } from "@material-ui/core";
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

const logUtils = new LogUtils();
const configProvider: IConfigProvider = new ConfigProvider(logUtils);
const governanceBlockchainProvider: IGovernanceBlockchainProvider =
  new GovernanceBlockchainProvider(configProvider, logUtils);

const App: React.FC = () => {
  const { setLoading, setResultMessage } = useLayoutContext();
  const classes = useStyles();
  const [appReady, setAppReady] = useState<boolean>(false);

  useEffect(() => {
    governanceBlockchainProvider
      .initialize()
      .map(() => {
        setAppReady(true);
        governanceBlockchainProvider.getProvider().map((provider) => {
          console.log("provider: ", provider);
        });
        governanceBlockchainProvider.getSigner().map((signer) => {
          console.log("signer: ", signer);
        });
      })
      .mapErr((e) => {
        console.log("governanceBlockchainProvider e: ", e);
      });
  }, []);

  return (
    <StoreProvider
      configProvider={configProvider}
      governanceBlockchainProvider={governanceBlockchainProvider}
    >
      <Box className={classes.appWrapper}>
        <BrowserRouter>
          <Header />
          {appReady && <Router />}
        </BrowserRouter>
      </Box>
    </StoreProvider>
  );
};

export default App;
