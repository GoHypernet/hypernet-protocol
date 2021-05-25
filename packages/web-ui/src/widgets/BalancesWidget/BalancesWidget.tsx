import React from "react";
import { Box } from "@material-ui/core";

import { BalanceList, BoxWrapper } from "@web-ui/components";
import { useBalances } from "@web-ui/hooks";
import { IRenderParams } from "@web-ui/interfaces";

import { useStyles } from "@web-ui/widgets/BalancesWidget/BalancesWidget.style";
import { useStoreContext } from "@web-ui/contexts";

interface IBalancesWidget extends IRenderParams {}

const BalancesWidget: React.FC<IBalancesWidget> = ({
  noLabel,
  includeBoxWrapper,
}: IBalancesWidget) => {
  const { balances } = useBalances();
  const { viewUtils } = useStoreContext();

  const classes = useStyles();

  const CustomBox = includeBoxWrapper ? BoxWrapper : Box;

  return (
    <CustomBox
      className={!includeBoxWrapper ? classes.balancesWrapper : ""}
      label={!noLabel ? "YOUR BALANCES" : undefined}
    >
      <BalanceList balances={balances} viewUtils={viewUtils} />
    </CustomBox>
  );
};

export default BalancesWidget;
