import React, { useEffect } from "react";
import { useLayoutContext } from "@user-dashboard/contexts";
import PageWrapper from "@user-dashboard/components/PageWrapper";
import BoxWrapper from "@user-dashboard/components/BoxWrapper";
import useStyles from "@user-dashboard/pages/Summary/Summary.style";
import Balances from "@user-dashboard/pages/Summary/components/Balances";

const Summary: React.FC = () => {
  const { setLoading, setResultMessage } = useLayoutContext();

  useEffect(() => {}, []);
  const classes = useStyles();

  return (
    <PageWrapper label="SUMMARY">
      <div className={classes.wrapper}>
        <div className={classes.leftContent}>
          <BoxWrapper label="TRANSACTION HISTORY">
            <div> BoxWrapper TRANSACTION HISTORY</div>
          </BoxWrapper>
        </div>
        <div className={classes.rightContent}>
          <Balances />
          <BoxWrapper label="YOUR SERVICES">
            <div> BoxWrapper YOUR SERVICES</div>
          </BoxWrapper>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Summary;
