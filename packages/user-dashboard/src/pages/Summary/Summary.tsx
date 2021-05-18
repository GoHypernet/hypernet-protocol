import React, { useEffect } from "react";
import { useLayoutContext } from "@user-dashboard/contexts";
import PageWrapper from "@user-dashboard/components/PageWrapper";
import BoxWrapper from "@user-dashboard/components/BoxWrapper";
import { useStyles } from "@user-dashboard/pages/Summary/Summary.style";
import Balances from "@user-dashboard/pages/Summary/components/Balances";
import { Box } from "@material-ui/core";

const Summary: React.FC = () => {
  const { setLoading, setResultMessage } = useLayoutContext();

  useEffect(() => { }, []);
  const classes = useStyles();

  return (
    <PageWrapper label="SUMMARY">
      <Box className={classes.wrapper}>
        <Box className={classes.leftContent}>
          <BoxWrapper label="TRANSACTION HISTORY">
            <Box> BoxWrapper TRANSACTION HISTORY</Box>
          </BoxWrapper>
        </Box>
        <Box className={classes.rightContent}>
          <Balances />
          <BoxWrapper label="YOUR SERVICES">
            <Box> BoxWrapper YOUR SERVICES</Box>
          </BoxWrapper>
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default Summary;
