import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";

import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { useStyles } from "@web-integration/widgets/HypertokenBalanceWidget/HypertokenBalanceWidget.style";
import { GovernanceButton } from "@web-integration/components";

const HypertokenBalanceWidget: React.FC = () => {
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const classes = useStyles();
  const { setLoading } = useLayoutContext();
  const [balance, setBalance] = useState();

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

  return (
    <GovernanceButton onClick={() => {}}>
      {balance}
      <img
        className={classes.logo}
        src="https://res.cloudinary.com/dqueufbs7/image/upload/v1623464753/images/HNPLogo.png"
        alt="HNPLogo"
      />
    </GovernanceButton>
  );
};

export default HypertokenBalanceWidget;
