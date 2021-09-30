import { useStoreContext } from "@web-ui/contexts";
import { IRenderParams } from "@web-ui/interfaces";
import React from "react";

import {
  GovernanceBalanceList,
  EmptyState,
  GovernanceCard,
} from "@web-ui/components";
import { useBalances } from "@web-ui/hooks";
import { useStyles } from "@web-ui/widgets/BalancesWidget/BalancesWidget.style";

interface IBalancesWidget extends IRenderParams {}

const BalancesWidget: React.FC<IBalancesWidget> = ({
  noLabel,
  includeBoxWrapper,
}: IBalancesWidget) => {
  const { loading, balancesByChannelAddress } = useBalances();
  const { viewUtils } = useStoreContext();

  const classes = useStyles();

  return (
    <GovernanceCard
      title={!noLabel ? "YOUR BALANCES" : undefined}
      className={!includeBoxWrapper ? classes.balancesWrapper : ""}
    >
      {balancesByChannelAddress.length === 0 && !loading ? (
        <EmptyState
          info={
            <>
              You don't have any balances yet, you can Fund your account from.
              <a href="/deposit-and-withdraw"> here</a>
            </>
          }
        />
      ) : (
        <GovernanceBalanceList
          balances={balancesByChannelAddress}
          viewUtils={viewUtils}
        />
      )}
    </GovernanceCard>
  );
};

export default BalancesWidget;
