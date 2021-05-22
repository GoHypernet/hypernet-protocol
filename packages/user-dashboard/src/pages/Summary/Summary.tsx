import React, { useEffect } from "react";
import PageWrapper from "@user-dashboard/components/PageWrapper";
import BoxWrapper from "@user-dashboard/components/BoxWrapper";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";
import { Box, Grid } from "@material-ui/core";

const Summary: React.FC = () => {
  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();

  useEffect(() => {
    hypernetWebIntegration.webUIClient
      .renderBalancesWidget({
        selector: "balances-wrapper",
        noLabel: true,
      })
      .mapErr(handleError);

    hypernetWebIntegration.webUIClient
      .renderMerchantsWidget({
        selector: "merchant-list-wrapper",
        noLabel: true,
      })
      .mapErr(handleError);

    hypernetWebIntegration.webUIClient
      .renderLinksWidget({
        selector: "payments-wrapper",
        noLabel: true,
      })
      .mapErr(handleError);
  }, []);

  return (
    <PageWrapper label="SUMMARY">
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <BoxWrapper label="TRANSACTION HISTORY">
            <Box id="payments-wrapper"></Box>
          </BoxWrapper>
        </Grid>
        <Grid item container xs={4} spacing={3}>
          <Grid item xs={12}>
            <BoxWrapper label="YOUR BALANCES">
              <Box id="balances-wrapper"></Box>
            </BoxWrapper>
          </Grid>
          <Grid item xs={12}>
            <BoxWrapper label="YOUR SERVICES">
              <Box id="merchant-list-wrapper"></Box>
            </BoxWrapper>
          </Grid>
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default Summary;
