import { Box } from "@material-ui/core";
import React, { useEffect } from "react";

import PageWrapper from "@user-dashboard/components/PageWrapper";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const LazyMintingRequests: React.FC = () => {
  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();

  useEffect(() => {
    hypernetWebIntegration.webUIClient
      .renderRegistryLazyMintingRequestsWidget({
        selector: "registry-lazy-minting-requests",
      })
      .mapErr(handleError);
  }, []);

  return (
    <PageWrapper label="Registries" isGovernance>
      <Box id="registry-lazy-minting-requests"></Box>
    </PageWrapper>
  );
};

export default LazyMintingRequests;
