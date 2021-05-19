import React from "react";
import { Box } from "@material-ui/core";

import { BalanceList } from "@web-ui/components";
import { useBalances } from "@web-ui/hooks";
import { useStyles } from "@web-ui/widgets/BalancesWidget/BalancesWidget.style";
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
    <Box className={classes.balancesWrapper}>
      {balances?.length && (
        <Box className={classes.balancesLabel}>Your Balances</Box>
      )}
      <BalanceList balances={balances} viewUtils={viewUtils} />
    </Box>
  );
};

export default BalancesWidget;
