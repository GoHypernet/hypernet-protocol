import React, { useEffect } from "react";
import HypernetWebIntegration, {
  IHypernetWebIntegration,
} from "@hypernetlabs/web-integration";
import { ResultMessage, EResultStatus } from "@hypernetlabs/web-ui";

import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";
import Router from "@user-dashboard/containers/Router";

const App: React.FC = () => {
  const { setLoading, setResultMessage } = useLayoutContext();
  const { setCoreProxy } = useStoreContext();

  useEffect(() => {
    const integration: IHypernetWebIntegration = new HypernetWebIntegration();

    setLoading(true);

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
      });
  }, []);

  return <Router />;
};

export default App;
