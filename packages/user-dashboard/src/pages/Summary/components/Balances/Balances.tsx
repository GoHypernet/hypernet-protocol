import React, { useEffect, useState } from "react";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";
import BoxWrapper from "@user-dashboard/components/BoxWrapper";
import { BalanceList as BalanceListUI } from "@hypernetlabs/web-ui";
import { AssetBalance } from "@hypernetlabs/objects";
import useStyles from "./Balances.style";

const Balances: React.FC = () => {
  const { handleError } = useLayoutContext();
  const { coreProxy } = useStoreContext();
  const [balanceList, setBalanceList] = useState<AssetBalance[]>();
  const classes = useStyles();

  useEffect(() => {
    coreProxy.waitInitialized().map(() => {
      coreProxy.getBalances().match((balances) => {
        setBalanceList(balances.assets);
      }, handleError);
    });
  }, []);

  return (
    <BoxWrapper label="YOUR BALANCES">
      <div className={classes.wrapper}>
        <BalanceListUI balances={balanceList} />
      </div>
    </BoxWrapper>
  );
};

export default Balances;
