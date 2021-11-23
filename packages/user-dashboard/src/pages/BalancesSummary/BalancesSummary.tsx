import { Box, Grid } from "@material-ui/core";
import React, { useEffect } from "react";

import PageWrapper from "@user-dashboard/components/PageWrapper";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const BalancesSummary: React.FC = () => {
  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();

  useEffect(() => {
    hypernetWebIntegration.webUIClient
      .renderBalancesSummaryWidget({
        selector: "balances-summary-wrapper",
      })
      .mapErr(handleError);
  }, []);

  return (
    <PageWrapper label="Balances Summary">
      <Box id="balances-summary-wrapper"></Box>
    </PageWrapper>
  );
};

export default BalancesSummary;
