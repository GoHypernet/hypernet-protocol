import { Box, Grid } from "@material-ui/core";
import React, { useEffect } from "react";

import PageWrapper from "@user-dashboard/components/PageWrapper";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const PaymentHistory: React.FC = () => {
  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();

  useEffect(() => {
    hypernetWebIntegration.webUIClient.payments
      .renderGatewaysWidget({
        selector: "gateway-list-wrapper",
      })
      .mapErr(handleError);

    hypernetWebIntegration.webUIClient.payments
      .renderLinksWidget({
        selector: "payments-wrapper",
      })
      .mapErr(handleError);

    hypernetWebIntegration.webUIClient.payments
      .renderStateChannelsWidget({
        selector: "state-channels",
      })
      .mapErr(handleError);

    hypernetWebIntegration.webUIClient.payments
      .renderPublicIdentifierWidget({
        selector: "public-identifier",
      })
      .mapErr(handleError);
  }, []);

  return (
    <PageWrapper label="Payment History">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box id="public-identifier"></Box>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box id="state-channels"></Box>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box id="payments-wrapper"></Box>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box id="gateway-list-wrapper"></Box>
        </Grid>
      </Grid>
    </PageWrapper>
  );
};

export default PaymentHistory;
