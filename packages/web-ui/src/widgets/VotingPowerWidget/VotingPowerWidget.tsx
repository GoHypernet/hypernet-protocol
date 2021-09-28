import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { Typography } from "@material-ui/core";

import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { useStyles } from "@web-integration/widgets/VotingPowerWidget/VotingPowerWidget.style";
import { IRenderParams } from "@web-ui/interfaces";

interface VotingPowerWidgetParams extends IRenderParams {}

const VotingPowerWidget: React.FC<VotingPowerWidgetParams> = () => {
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const classes = useStyles();
  const { setLoading } = useLayoutContext();
  const [votingPower, setVotingPower] = useState<number>();

  useEffect(() => {
    coreProxy
      .getEthereumAccounts()
      .map((accounts) => {
        coreProxy
          .getVotingPower(accounts[0])
          .map((votingPower) => {
            console.log("accounts VotingPowerWidget: ", accounts);
            setVotingPower(votingPower);
          })
          .mapErr(handleError);
      })
      .mapErr(handleError);
  }, []);

  const handleError = (err?: Error) => {
    console.log("handleError err: ", err);
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  return (
    <Typography className={classes.root}>{`${votingPower} votes`}</Typography>
  );
};

export default VotingPowerWidget;
