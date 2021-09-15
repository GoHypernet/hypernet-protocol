import { Box } from "@material-ui/core";
import React, { useEffect } from "react";

import PageWrapper from "@user-dashboard/components/PageWrapper";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const Gateways: React.FC = () => {
  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();

  useEffect(() => {
    hypernetWebIntegration.webUIClient
      .renderProposalsWidget({
        selector: "gateways-page-wrapper",
        includeBoxWrapper: true,
      })
      .mapErr(handleError);
  }, []);

  return (
    <PageWrapper label="Proposals">
      <Box id="proposals-page-wrapper"></Box>
    </PageWrapper>
  );
};

export default Gateways;
