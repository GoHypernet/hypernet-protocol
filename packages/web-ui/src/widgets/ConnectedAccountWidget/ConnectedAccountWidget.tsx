import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { useAlert } from "react-alert";

import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { EthereumAddress } from "@hypernetlabs/objects";

const ConnectedAccountWidget: React.FC = () => {
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>(
    EthereumAddress(""),
  );

  useEffect(() => {
    coreProxy
      .getEthereumAccounts()
      .map((accounts) => {
        console.log("accounts ConnectedAccountWidget: ", accounts);
        setAccountAddress(accounts[0]);
      })
      .mapErr(handleError);
  }, []);

  const handleError = (err?: Error) => {
    console.log("handleError err: ", err);
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  return <Typography>{accountAddress}</Typography>;
};

export default ConnectedAccountWidget;
