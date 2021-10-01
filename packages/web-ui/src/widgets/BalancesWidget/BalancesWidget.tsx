import { useStoreContext } from "@web-ui/contexts";
import { IRenderParams } from "@web-ui/interfaces";
import React from "react";
import { Box } from "@material-ui/core";
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
      title={!noLabel ? "Your Balances" : undefined}
      description={!noLabel ? "Available token balances in this Hypernet Protocol account." : undefined}
      className={!includeBoxWrapper ? classes.balancesWrapper : ""}
    >
      {balancesByChannelAddress.length === 0 && !loading ? (
        <Box display="flex" justifyContent="center">
          <EmptyState
            info={
              <>
                You don't have any balances yet, you can Fund your account from
                <a href="/deposit-and-withdraw"> here. </a>
              </>
            }
          />
        </Box>
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
