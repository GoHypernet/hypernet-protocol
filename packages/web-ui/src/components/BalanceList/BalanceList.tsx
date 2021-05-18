import { AssetBalance } from "@hypernetlabs/objects";
import React from "react";

import useStyles from "./BalanceList.style";

import { useStoreContext } from "@web-ui/contexts";

interface BalanceListProps {
  balances?: AssetBalance[];
}

export const BalanceList: React.FC<BalanceListProps> = (
  props: BalanceListProps,
) => {
  console.log("propspropsprops", props);
  const { balances } = props;
  const classes = useStyles((props as unknown) as Jss.Theme);
  const { viewUtils } = useStoreContext();

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
            {balance.symbol || index === 0 ? "HPT" : "MINT"}
          </div>
        </div>
      ))}
    </div>
  );
};
