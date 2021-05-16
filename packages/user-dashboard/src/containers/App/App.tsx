import React, { useEffect } from "react";
import HypernetWebIntegration, {
  IHypernetWebIntegration,
} from "@hypernetlabs/web-integration";
import { BrowserRouter } from "react-router-dom";
import { ResultMessage, EResultStatus } from "@hypernetlabs/web-ui";

import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";
import Router from "@user-dashboard/containers/Router";
import useStyles from "./App.style";
import Header from "@user-dashboard/components/Header";

const App: React.FC = () => {
  const { setLoading, setResultMessage } = useLayoutContext();
  const { setCoreProxy } = useStoreContext();
  const classes = useStyles();

  useEffect(() => {
    const integration: IHypernetWebIntegration = new HypernetWebIntegration();

    /* setLoading(true);

    integration
      .getReady()
      .map((coreProxy) => {
        setCoreProxy(coreProxy);
        setLoading(false);
      })
      .mapErr((e) => {
        setResultMessage(
          new ResultMessage(
            EResultStatus.FAILURE,
            e.message || "Something went wrong!",
          ),
        );
      }); */
  }, []);

  return (
    <div className={classes.appWrapper}>
      <BrowserRouter>
        <Header />
        <Router />
      </BrowserRouter>
    </div>
  );
};

export default App;
