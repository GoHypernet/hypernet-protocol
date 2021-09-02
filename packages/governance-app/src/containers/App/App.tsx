import HypernetWebIntegration, {
  IHypernetWebIntegration,
} from "@hypernetlabs/web-integration";
import { ResultMessage, EResultStatus } from "@hypernetlabs/web-ui";
import { Box } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { useStyles } from "./App.style";

import Header from "@governance-app/components/Header";
import Router from "@governance-app/containers/Router";
import { useLayoutContext, StoreProvider } from "@governance-app/contexts";

declare const __CORE_IFRAME_SOURCE__: string;

const integration: IHypernetWebIntegration = new HypernetWebIntegration(
  __CORE_IFRAME_SOURCE__,
);

const App: React.FC = () => {
  const { setLoading, setResultMessage } = useLayoutContext();
  const classes = useStyles();
  const [coreReady, setCoreReady] = useState<boolean>(false);

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
      <Box className={classes.appWrapper}>
        <BrowserRouter>
          <Header />
          {coreReady && <Router />}
        </BrowserRouter>
      </Box>
    </StoreProvider>
  );
};

export default App;
