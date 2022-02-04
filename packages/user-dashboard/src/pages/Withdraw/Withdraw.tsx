import { Box, Grid } from "@material-ui/core";
import React, { useEffect } from "react";

import PageWrapper from "@user-dashboard/components/PageWrapper";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const Withdraw: React.FC = () => {
  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();

  useEffect(() => {
    hypernetWebIntegration.webUIClient.payments
      .renderWithdrawWidget({
        selector: "withdraw-wrapper",
        bodyStyle: { padding: "0 25% 30px 25%" },
      })
      .mapErr(handleError);

    hypernetWebIntegration.webUIClient.payments
      .renderBalancesWidget({
        selector: "balances-wrapper",
      })
      .mapErr(handleError);
  }, []);

  return (
    <PageWrapper label="Withdraw">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box id="balances-wrapper"></Box>
        </Grid>
        <Grid item xs={12}>
          <Box id="withdraw-wrapper"></Box>
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default Withdraw;
