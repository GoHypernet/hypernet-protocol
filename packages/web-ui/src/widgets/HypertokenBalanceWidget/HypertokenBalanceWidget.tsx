import React, { useEffect, useState } from "react";
import { Typography, Box } from "@material-ui/core";

import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { useStyles } from "@web-ui/widgets/HypertokenBalanceWidget/HypertokenBalanceWidget.style";
import { IRenderParams } from "@web-ui/interfaces";
import { HYPER_TOKEN_LOGO_PURPLE_URL } from "@web-ui/constants";

interface HypertokenBalanceWidgetParams extends IRenderParams {}

const HypertokenBalanceWidget: React.FC<HypertokenBalanceWidgetParams> = () => {
  const { coreProxy } = useStoreContext();
  const classes = useStyles();
  const { setLoading, handleCoreError } = useLayoutContext();
  const [balance, setBalance] = useState<number>();

  useEffect(() => {
    setLoading(true);
    coreProxy.governance
      .waitGovernanceInitialized()
      .map(() => {
        coreProxy
          .getEthereumAccounts()
          .map((accounts) => {
            coreProxy.governance
              .getHyperTokenBalance(accounts[0])
              .map((balance) => {
                setBalance(balance);
                setLoading(false);
              })
              .mapErr(handleCoreError);
          })
          .mapErr(handleCoreError);
      })
      .mapErr(handleCoreError);
  }, []);

  return (
    <Box className={classes.wrapper}>
      <Typography>{balance || "0.0000"}</Typography>
      <img className={classes.logo} src={HYPER_TOKEN_LOGO_PURPLE_URL} />
    </Box>
  );
};

export default HypertokenBalanceWidget;
