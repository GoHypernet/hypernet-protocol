import { AssetBalance } from "@hypernetlabs/objects";
import { Box, Tooltip } from "@material-ui/core";
import { IViewUtils } from "@web-ui/interfaces";
import React, { useRef } from "react";

import { useStyles } from "@web-ui/components/BalanceList/BalanceList.style";
import { HYPER_TOKEN_LOGO_URL } from "@web-ui/constants";

interface BalanceListProps {
  balances?: AssetBalance[];
  viewUtils: IViewUtils;
  noBorder?: boolean;
}

export const BalanceList: React.FC<BalanceListProps> = (
  props: BalanceListProps,
) => {
  const { balances, viewUtils, noBorder } = props;
  const tokenLogoRef = useRef<HTMLImageElement>(null);
  const classes = useStyles();

  return (
    <Box
      className={`${classes.container} ${noBorder ? "" : classes.itemBorder}`}
    >
      {balances?.map((balance, index) => (
        <Box
          key={index}
          className={`${classes.itemWrapper} ${
            noBorder
              ? index === balances.length - 1
                ? ""
                : classes.itemBorderBottom
              : classes.itemBorder
          }`}
        >
          <img
            className={classes.tokenLogo}
            src={`https://icons.bitbot.tools/api/${balance.symbol}/64x64`}
            ref={tokenLogoRef}
            onError={() => {
              tokenLogoRef.current?.setAttribute("src", HYPER_TOKEN_LOGO_URL);
            }}
          />
          <Box className={classes.tokenAmount}>
            {viewUtils.fromBigNumberEther(balance.freeAmount)}
          </Box>
          <Box className={classes.tokenName}>
            <Tooltip
              title={
                balance.name === "Test Token" ? "HyperToken" : balance.name
              }
              placement="top"
            >
              <Box>{balance.symbol === "TEST" ? "HYPR" : balance.symbol}</Box>
            </Tooltip>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
