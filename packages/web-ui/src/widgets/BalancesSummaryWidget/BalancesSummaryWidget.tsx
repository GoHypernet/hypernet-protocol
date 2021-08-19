import { Box, Grid } from "@material-ui/core";
import { useStoreContext } from "@web-ui/contexts";
import { IRenderParams } from "@web-ui/interfaces";
import React from "react";

import { BalanceList, BoxWrapper, EmptyState } from "@web-ui/components";
import { useBalances } from "@web-ui/hooks";
import { useStyles } from "@web-ui/widgets/BalancesSummaryWidget/BalancesSummaryWidget.style";

interface IBalancesSummaryWidget extends IRenderParams {}

const BalancesSummaryWidget: React.FC<IBalancesSummaryWidget> = ({
  noLabel,
  includeBoxWrapper,
  bodyStyle,
}: IBalancesSummaryWidget) => {
  const { loading, balancesByChannelAddresses } = useBalances();
  const { viewUtils } = useStoreContext();

  const classes = useStyles();

  const CustomBox = includeBoxWrapper ? BoxWrapper : Box;

  const channelAddresses = [...balancesByChannelAddresses.keys()];

  return (
    <>
      {channelAddresses.map((channelAddress) => (
        <CustomBox
          className={!includeBoxWrapper ? classes.balancesWrapper : ""}
          label={
            !noLabel
              ? `Your Balances for State Channel Address: ${channelAddress}`
              : undefined
          }
          bodyStyle={bodyStyle}
          hasEmptyState={channelAddresses.length === 0 && !loading}
          emptyState={
            <EmptyState
              info="You don't have any state channels yet, you need to authorize a
          gateway first."
            />
          }
        >
          {balancesByChannelAddresses.get(channelAddress) ? (
            <BalanceList
              balances={balancesByChannelAddresses.get(channelAddress)}
              viewUtils={viewUtils}
              noBorder={includeBoxWrapper}
            />
          ) : (
            <Box>No balances yet for this channel address</Box>
          )}
        </CustomBox>
      ))}
    </>
  );
};

export default BalancesSummaryWidget;
