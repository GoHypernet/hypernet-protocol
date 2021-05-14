import React, { useEffect, useState } from "react";
import HypernetWebIntegration, {
  IHypernetWebIntegration,
} from "@hypernetlabs/web-integration";
import { ResultMessage, EResultStatus } from "@hypernetlabs/web-ui";

import { LayoutProvider, StoreProvider } from "@user-dashboard/contexts";

const App: React.FC = () => {
  const [initializing, setInitializing] = useState<boolean>(true);
  const [resultMessage, setResultMessage] = useState<ResultMessage>(
    new ResultMessage(EResultStatus.IDLE, ""),
  );
  const [
    HNPIntegration,
    setHNPIntegration,
  ] = useState<IHypernetWebIntegration>();

  useEffect(() => {
    const integration: IHypernetWebIntegration = new HypernetWebIntegration();
    setHNPIntegration(integration);

    setInitializing(true);
    integration
      .getReady()
      .map(() => {
        setInitializing(false);
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
    <StoreProvider proxy={HNPIntegration?.core}>
      <LayoutProvider loading={initializing} resultMessage={resultMessage}>
        App
      </LayoutProvider>
    </StoreProvider>
  );
};

export default App;
