import React from "react";

import { BalanceList } from "@web-ui/components";
import { useBalances } from "@web-ui/hooks";
import useStyles from "@web-ui/widgets/BalancesWidget/BalancesWidget.style";
import { useStoreContext } from "@web-ui/contexts";

const BalancesWidget: React.FC = () => {
  const { balances } = useBalances();
  const { viewUtils } = useStoreContext();

  const classes = useStyles();

  return (
    <div className={classes.balancesWrapper}>
      {balances?.length && (
        <div className={classes.balancesLabel}>Your Balances</div>
      )}
      <BalanceList balances={balances} viewUtils={viewUtils} />
    </div>
  );
};

export default BalancesWidget;
