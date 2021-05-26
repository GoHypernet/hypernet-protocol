import React from "react";
import { Box } from "@material-ui/core";

import { AssetBalance } from "@hypernetlabs/objects";
import { useStyles } from "@web-ui/components/BalanceList/BalanceList.style";
import { IViewUtils } from "@web-ui/interfaces";
import { ETHER_HEX_ADDRESS } from "@web-ui/constants";

interface BalanceListProps {
  balances?: AssetBalance[];
  viewUtils: IViewUtils;
  noBorder?: boolean;
}

export const BalanceList: React.FC<BalanceListProps> = (
  props: BalanceListProps,
) => {
  const { balances, viewUtils, noBorder } = props;
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
            src={
              index === 0
                ? "https://res.cloudinary.com/dqueufbs7/image/upload/v1614369421/images/Screen_Shot_2021-02-26_at_22.56.34.png"
                : "https://res.cloudinary.com/dqueufbs7/image/upload/v1614373316/images/Screen_Shot_2021-02-27_at_00.01.31.png"
            }
          />
          <Box className={classes.tokenAmount}>
            {viewUtils.fromBigNumberEther(balance.freeAmount)}
          </Box>
          <Box className={classes.tokenName}>
            {balance.assetAddress === ETHER_HEX_ADDRESS ? "ETH" : "MINT"}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
