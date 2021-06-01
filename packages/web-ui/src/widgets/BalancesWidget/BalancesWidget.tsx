import React from "react";
import { Box } from "@material-ui/core";

import { BalanceList, BoxWrapper, EmptyState } from "@web-ui/components";
import { useBalances } from "@web-ui/hooks";
import { IRenderParams } from "@web-ui/interfaces";

import { useStyles } from "@web-ui/widgets/BalancesWidget/BalancesWidget.style";
import { useStoreContext } from "@web-ui/contexts";

interface IBalancesWidget extends IRenderParams {}

const BalancesWidget: React.FC<IBalancesWidget> = ({
  noLabel,
  includeBoxWrapper,
  bodyStyle,
}: IBalancesWidget) => {
  const { balances, loading } = useBalances();
  const { viewUtils } = useStoreContext();

  const classes = useStyles();

  const CustomBox = includeBoxWrapper ? BoxWrapper : Box;

  return (
    <CustomBox
      className={!includeBoxWrapper ? classes.balancesWrapper : ""}
      label={!noLabel ? "YOUR BALANCES" : undefined}
      bodyStyle={bodyStyle}
      hasEmptyState={balances.length === 0 && !loading}
      emptyState={
        <EmptyState
          info={
            <>
              You don't have any balances yet, you can Fund your account from.
              <a href="/send-and-recieve"> here</a>
            </>
          }
        />
      }
    >
      <BalanceList
        balances={balances}
        viewUtils={viewUtils}
        noBorder={includeBoxWrapper}
      />
    </CustomBox>
  );
};

export default BalancesWidget;
