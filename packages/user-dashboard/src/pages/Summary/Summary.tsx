import React, { useEffect } from "react";
import PageWrapper from "@user-dashboard/components/PageWrapper";
import BoxWrapper from "@user-dashboard/components/BoxWrapper";
import { useStyles } from "@user-dashboard/pages/Summary/Summary.style";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";
import { Box } from "@material-ui/core";

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
  }, []);
  const classes = useStyles();

  return (
    <PageWrapper label="SUMMARY">
      <Box className={classes.wrapper}>
        <Box className={classes.upporContent}>
          <BoxWrapper label="YOUR BALANCES" flex={1}>
            <Box id="balances-wrapper"></Box>
          </BoxWrapper>
          <BoxWrapper label="YOUR SERVICES" flex={1}>
            <Box id="merchant-list-wrapper"></Box>
          </BoxWrapper>
        </Box>
        <Box className={classes.bottomContent}>
          <BoxWrapper label="TRANSACTION HISTORY">
            <Box> BoxWrapper TRANSACTION HISTORY</Box>
          </BoxWrapper>
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default Summary;
