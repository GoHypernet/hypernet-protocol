import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";

import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { useStyles } from "@web-integration/widgets/HypertokenBalanceWidget/HypertokenBalanceWidget.style";
import { GovernanceButton } from "@web-integration/components";
import { IRenderParams } from "@web-ui/interfaces";

interface HypertokenBalanceWidgetParams extends IRenderParams {}

const HypertokenBalanceWidget: React.FC<HypertokenBalanceWidgetParams> = () => {
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const classes = useStyles();
  const { setLoading } = useLayoutContext();
  const [balance, setBalance] = useState(0.0001);

  useEffect(() => {
    setLoading(true);
    coreProxy
      .getBalances()
      .map((accounts) => {
        // console.log("accounts HypertokenBalanceWidget: ", accounts);
        // setAccountAddress(accounts[0]);
      })
      .mapErr(handleError);
  }, []);

  const handleError = (err?: Error) => {
    console.log("handleError err: ", err);
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  return <GovernanceButton onClick={() => {}}>{balance} H</GovernanceButton>;
};

export default HypertokenBalanceWidget;
