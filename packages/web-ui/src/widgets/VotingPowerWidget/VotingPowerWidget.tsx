import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";

import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { useStyles } from "@web-ui/widgets/VotingPowerWidget/VotingPowerWidget.style";
import { IRenderParams } from "@web-ui/interfaces";

interface VotingPowerWidgetParams extends IRenderParams {}

const VotingPowerWidget: React.FC<VotingPowerWidgetParams> = () => {
  const { coreProxy, UIData } = useStoreContext();
  const classes = useStyles();
  const { handleCoreError } = useLayoutContext();
  const [votingPower, setVotingPower] = useState<number>();

  useEffect(() => {
    getVotingPower();
    UIData.onVotesDelegated.subscribe(() => {
      getVotingPower();
    });
  }, []);

  const getVotingPower = () => {
    coreProxy
      .waitInitialized()
      .map(() => {
        coreProxy
          .getEthereumAccounts()
          .map((accounts) => {
            coreProxy
              .getVotingPower(accounts[0])
              .map((votingPower) => {
                setVotingPower(votingPower);
              })
              .mapErr(handleCoreError);
          })
          .mapErr(handleCoreError);
      })
      .mapErr(handleCoreError);
  };

  return (
    <Typography className={classes.root}>{`${
      votingPower || "0.0000"
    } votes`}</Typography>
  );
};

export default VotingPowerWidget;
