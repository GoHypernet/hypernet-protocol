import { useStoreContext } from "@web-ui/contexts";
import { IRenderParams } from "@web-ui/interfaces";
import React from "react";
import { Box, Typography } from "@material-ui/core";
import {
  GovernanceBalanceList,
  GovernanceEmptyState,
  GovernanceCard,
} from "@web-ui/components";
import { useBalances } from "@web-ui/hooks";
import { useStyles } from "@web-ui/widgets/BalancesWidget/BalancesWidget.style";

interface IBalancesWidget extends IRenderParams {}

const BalancesWidget: React.FC<IBalancesWidget> = ({
  noLabel,
  excludeCardWrapper,
}: IBalancesWidget) => {
  const { loading, balancesByChannelAddress } = useBalances();
  const { viewUtils } = useStoreContext();

  const classes = useStyles();

  return (
    <GovernanceCard
    {...(excludeCardWrapper && { className: classes.nudeCard })}
    hideDivider={excludeCardWrapper}
      title={!noLabel ? "Your Balances" : undefined}
      description={
        !noLabel
          ? "Available token balances in this Hypernet account."
          : undefined
      }
    >
      {balancesByChannelAddress.length === 0 && !loading ? (
        <Box display="flex" justifyContent="center">
          <GovernanceEmptyState
            title="Ups..!"
            description={
              <Typography variant="body2">
                You don't have any balances yet, you can Fund your account from
                <a href="/deposit-and-withdraw"> here. </a>
              </Typography>
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
