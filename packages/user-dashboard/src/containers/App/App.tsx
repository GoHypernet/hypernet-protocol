import React, { useEffect } from "react";
import HypernetWebIntegration, {
  IHypernetWebIntegration,
} from "@hypernetlabs/web-integration";
import { BrowserRouter } from "react-router-dom";
import { ResultMessage, EResultStatus } from "@hypernetlabs/web-ui";

import { useLayoutContext } from "@user-dashboard/contexts";
import Router from "@user-dashboard/containers/Router";
import useStyles from "./App.style";
import Header from "@user-dashboard/components/Header";
import { StoreProvider } from "@user-dashboard/contexts";

const integration: IHypernetWebIntegration = new HypernetWebIntegration();

const App: React.FC = () => {
  const { setLoading, setResultMessage } = useLayoutContext();
  const classes = useStyles();

  useEffect(() => {
    setLoading(true);

    integration
      .getReady()
      .map((coreProxy) => {
        setLoading(false);
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
    <StoreProvider hypernetCore={integration.core}>
      <div className={classes.appWrapper}>
        <BrowserRouter>
          <Header />
          <Router />
        </BrowserRouter>
      </div>
    </StoreProvider>
  );
};

export default App;
