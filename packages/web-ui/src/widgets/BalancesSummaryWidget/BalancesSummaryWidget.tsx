import { Grid, Typography } from "@material-ui/core";
import { useStoreContext } from "@web-ui/contexts";
import { IRenderParams } from "@web-ui/interfaces";
import React from "react";

import {
  GovernanceEmptyState,
  GovernanceBalanceList,
  GovernanceCard,
} from "@web-ui/components";
import { useBalances } from "@web-ui/hooks";
import { useStyles } from "@web-ui/widgets/BalancesSummaryWidget/BalancesSummaryWidget.style";

interface IBalancesSummaryWidget extends IRenderParams {}

const BalancesSummaryWidget: React.FC<IBalancesSummaryWidget> = ({
  noLabel,
  includeBoxWrapper,
}: IBalancesSummaryWidget) => {
  const { loading, balancesByChannelAddresses } = useBalances();
  const { viewUtils } = useStoreContext();

  const classes = useStyles();

  const channelAddresses = [...balancesByChannelAddresses.keys()];

  if (channelAddresses.length === 0 && !loading) {
    return (
      <GovernanceCard>
        <GovernanceEmptyState
          title="Ups..!"
          description="You don't have any state channels yet, you need to authorize a gateway first."
        />
      </GovernanceCard>
    );
  }
  return (
    <>
      <Grid container spacing={3}>
        {channelAddresses.map((channelAddress) => (
          <Grid item xs={12}>
            <GovernanceCard
              title={
                !noLabel
                  ? `Your Balances for State Channel Address: ${channelAddress}`
                  : undefined
              }
              description={
                !noLabel
                  ? "The current balance of your Hypernet Protocol account."
                  : undefined
              }
              className={!includeBoxWrapper ? classes.balancesWrapper : ""}
            >
              {balancesByChannelAddresses.get(channelAddress) ? (
                <GovernanceBalanceList
                  balances={balancesByChannelAddresses.get(channelAddress)}
                  viewUtils={viewUtils}
                />
              ) : (
                <Typography>
                  No balances yet for this channel address
                </Typography>
              )}
            </GovernanceCard>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default BalancesSummaryWidget;
