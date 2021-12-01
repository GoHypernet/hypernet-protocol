import { EthereumAccountAddress } from "@hypernetlabs/objects";
import { Typography, Box } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { IRenderParams } from "@web-ui/interfaces";
import React, { useEffect, useState } from "react";

import { useStyles } from "@web-ui/widgets/ConnectedAccountWidget/ConnectedAccountWidget.style";

interface ConnectedAccountWidgetParams extends IRenderParams {}

const ConnectedAccountWidget: React.FC<ConnectedAccountWidgetParams> = () => {
  const classes = useStyles();
  const { coreProxy } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();
  const [accountAddress, setAccountAddress] =
    useState<EthereumAccountAddress>();

  useEffect(() => {
    setLoading(true);
    coreProxy
      .waitInitialized()
      .map(() => {
        coreProxy
          .getEthereumAccounts()
          .map((accounts) => {
            setAccountAddress(accounts[0]);
            setLoading(false);
          })
          .mapErr(handleCoreError);
      })
      .mapErr(handleCoreError);
  }, []);

  if (accountAddress == null) return <></>;

  return (
    <Box className={classes.wrapper}>
      <Typography>
        {accountAddress.slice(0, 6)}...{accountAddress.slice(-4)}
      </Typography>
    </Box>
  );
};

export default ConnectedAccountWidget;
