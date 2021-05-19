import React from "react";

import { BalanceList } from "@web-ui/components";
import { useBalances } from "@web-ui/hooks";
import useStyles from "@web-ui/widgets/BalancesWidget/BalancesWidget.style";
import { useStoreContext } from "@web-ui/contexts";

interface IBalancesWidget {
  noLabel?: boolean;
}

const BalancesWidget: React.FC<IBalancesWidget> = ({
  noLabel,
}: IBalancesWidget) => {
  const { balances } = useBalances();
  const { viewUtils } = useStoreContext();

  const classes = useStyles();

  return noLabel ? (
    <BalanceList balances={balances} viewUtils={viewUtils} />
  ) : (
    <div className={classes.balancesWrapper}>
      {balances?.length && (
        <div className={classes.balancesLabel}>Your Balances</div>
      )}
      <BalanceList balances={balances} viewUtils={viewUtils} />
    </div>
  );
};

export default BalancesWidget;
