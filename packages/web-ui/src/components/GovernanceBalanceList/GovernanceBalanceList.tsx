import { AssetBalance } from "@hypernetlabs/objects";
import { Box, Tooltip, Typography } from "@material-ui/core";
import { IViewUtils } from "@web-ui/interfaces";

import React, { useRef } from "react";

import { useStyles } from "@web-ui/components/GovernanceBalanceList/GovernanceBalanceList.style";
import { HYPER_TOKEN_LOGO_URL } from "@web-ui/constants";

interface GovernanceBalanceListProps {
  balances?: AssetBalance[];
  viewUtils: IViewUtils;
}

export const GovernanceBalanceList: React.FC<GovernanceBalanceListProps> = (
  props: GovernanceBalanceListProps,
) => {
  const { balances, viewUtils } = props;

  const tokenLogoRef = useRef<HTMLImageElement>(null);
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      {balances?.map((balance, index) => (
        <Box key={index} className={`${classes.itemWrapper}`}>
          <Box display="flex" alignItems="center">
            <img
              className={classes.tokenLogo}
              src={
                balance.symbol === "HYPR" || balance.symbol === "HYPR"
                  ? HYPER_TOKEN_LOGO_URL
                  : `https://cryptoicon-api.vercel.app/api/icon/${balance.symbol.toLocaleLowerCase()}`
              }
              ref={tokenLogoRef}
              onError={() => {
                tokenLogoRef.current?.setAttribute("src", HYPER_TOKEN_LOGO_URL);
              }}
            />
            <Typography variant="h4">{balance.name.toUpperCase()}</Typography>
          </Box>
          <Box display="flex">
            <Typography
              variant="h4"
              color="textPrimary"
              className={classes.tokenAmount}
            >
              {viewUtils.convertToEther(balance.freeAmount)}
            </Typography>
            <Tooltip title={balance.name} placement="top">
              <Typography variant="h4" color="textSecondary">
                {balance.symbol}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
