import { EthereumAccountAddress } from "@hypernetlabs/objects";
import { Typography, Box } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { IRenderParams } from "@web-ui/interfaces";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";

import { useStyles } from "@web-ui/widgets/ConnectedAccountWidget/ConnectedAccountWidget.style";

interface ConnectedAccountWidgetParams extends IRenderParams {}

const ConnectedAccountWidget: React.FC<ConnectedAccountWidgetParams> = () => {
  const alert = useAlert();
  const classes = useStyles();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
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
          .mapErr(handleError);
      })
      .mapErr(handleError);
  }, []);

  const handleError = (err) => {
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

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
