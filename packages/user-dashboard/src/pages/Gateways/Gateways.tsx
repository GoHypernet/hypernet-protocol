import { Box } from "@material-ui/core";
import React, { useEffect } from "react";

import PageWrapper from "@user-dashboard/components/PageWrapper";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const Gateways: React.FC = () => {
  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();

  useEffect(() => {
    hypernetWebIntegration.webUIClient
      .renderGatewaysWidget({
        selector: "gateways-page-wrapper",
      })
      .mapErr(handleError);
  }, []);

  return (
    <PageWrapper label="Gateways">
      <Box id="gateways-page-wrapper"></Box>
    </PageWrapper>
  );
};

export default Gateways;
