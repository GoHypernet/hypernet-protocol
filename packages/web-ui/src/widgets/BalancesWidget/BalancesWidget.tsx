import { Box } from "@material-ui/core";
import { useStoreContext } from "@web-ui/contexts";
import { IRenderParams } from "@web-ui/interfaces";
import React from "react";

import { BalanceList, BoxWrapper, EmptyState } from "@web-ui/components";
import { useBalances } from "@web-ui/hooks";
import { useStyles } from "@web-ui/widgets/BalancesWidget/BalancesWidget.style";

interface IBalancesWidget extends IRenderParams {}

const BalancesWidget: React.FC<IBalancesWidget> = ({
  noLabel,
  includeBoxWrapper,
  bodyStyle,
}: IBalancesWidget) => {
  const { loading, balancesByChannelAddress } = useBalances();
  const { viewUtils } = useStoreContext();

  const classes = useStyles();

  const CustomBox = includeBoxWrapper ? BoxWrapper : Box;

  return (
    <CustomBox
      className={!includeBoxWrapper ? classes.balancesWrapper : ""}
      label={!noLabel ? "YOUR BALANCES" : undefined}
      bodyStyle={bodyStyle}
      hasEmptyState={balancesByChannelAddress.length === 0 && !loading}
      emptyState={
        <EmptyState
          info={
            <>
              You don't have any balances yet, you can Fund your account from.
              <a href="/deposit-and-withdraw"> here</a>
            </>
          }
        />
      }
    >
      <BalanceList
        balances={balancesByChannelAddress}
        viewUtils={viewUtils}
        noBorder={includeBoxWrapper}
      />
    </CustomBox>
  );
};

export default BalancesWidget;
