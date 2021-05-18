import { AssetBalance } from "@hypernetlabs/objects";
import React from "react";

import useStyles from "./BalanceList.style";
import { IViewUtils } from "@web-ui/interfaces";
import { ETHER_HEX_ADDRESS } from "@web-ui/constants";

interface BalanceListProps {
  balances?: AssetBalance[];
  viewUtils: IViewUtils;
}

export const BalanceList: React.FC<BalanceListProps> = (
  props: BalanceListProps,
) => {
  const { balances, viewUtils } = props;
  const classes = useStyles((props as unknown) as Jss.Theme);

  return (
    <div className={classes.container}>
      {balances?.map((balance, index) => (
        <div key={index} className={classes.itemWrapper}>
          <img
            className={classes.tokenLogo}
            src={
              index === 0
                ? "https://res.cloudinary.com/dqueufbs7/image/upload/v1614369421/images/Screen_Shot_2021-02-26_at_22.56.34.png"
                : "https://res.cloudinary.com/dqueufbs7/image/upload/v1614373316/images/Screen_Shot_2021-02-27_at_00.01.31.png"
            }
          />
          <div className={classes.tokenAmount}>
            {viewUtils.fromBigNumber(balance.freeAmount)}
          </div>
          <div className={classes.tokenName}>
            {balance.assetAddress === ETHER_HEX_ADDRESS ? "ETH" : "MINT"}
          </div>
        </div>
      ))}
    </div>
  );
};
