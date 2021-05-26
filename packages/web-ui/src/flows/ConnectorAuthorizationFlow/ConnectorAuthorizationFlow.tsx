import { IConnectorAuthorizationFlowParams } from "@web-ui/interfaces";
import React, { useEffect } from "react";

import {
  ModalHeader,
  ModalFooter,
  SucessContent,
  BalanceList,
  Button,
} from "@web-ui/components";
import { useLayoutContext, useStoreContext } from "@web-ui/contexts";
import useStyles from "@web-ui/flows/ConnectorAuthorizationFlow/ConnectorAuthorizationFlow.style";
import { useBalances } from "@web-ui/hooks";
import { EStatusColor } from "@web-ui/theme";
import BalancesWidget from "@web-ui/widgets/BalancesWidget/BalancesWidget";

const ConnectorAuthorizationFlow: React.FC<IConnectorAuthorizationFlowParams> = (
  props: IConnectorAuthorizationFlowParams,
) => {
  const {
    connectorUrl,
    connectorName = "Hypernet",
    connectorLogoUrl = "https://res.cloudinary.com/dqueufbs7/image/upload/v1614369421/images/Screen_Shot_2021-02-26_at_22.56.34.png",
  } = props;
  const { balances } = useBalances();
  const { proxy } = useStoreContext();
  const { setModalWidth, setModalStatus, closeModal } = useLayoutContext();
  const classes = useStyles();

  useEffect(() => {
    proxy.onMerchantAuthorized.subscribe(() => {
      closeModal();
    });

    // Destroy self modal if merchant modal is visible.
    const iframeElements = document.getElementsByName(
      "hypernet-core-merchant-connector-iframe",
    );
    if (iframeElements.length && iframeElements[0].style.display === "block") {
      closeModal();
    }

    proxy.onAuthorizedMerchantActivationFailed.subscribe(() => {
      // show some error
      console.log("onAuthorizedMerchantActivationFailed");
    });
  }, []);

  const handleMerchantAuthorization = () => {
    proxy.authorizeMerchant(connectorUrl).match(
      () => {
        setModalWidth(565);
        setModalStatus(EStatusColor.SUCCESS);
      },
      (err) => {
        console.log("yo stop, we have some error");
      },
    );
  };

  return (
    <div className={classes.container}>
      <ModalHeader />
      {balances?.length ? (
        <BalancesWidget />
      ) : (
        <div className={classes.balancesEmptyLabel}>You are one step away!</div>
      )}
      <Button
        label="Authorize Merchant"
        onClick={handleMerchantAuthorization}
        fullWidth={true}
        bgColor="linear-gradient(98deg, rgba(0,120,255,1) 0%, rgba(126,0,255,1) 100%)"
      />
      <ModalFooter />
    </div>
  );
};

export default ConnectorAuthorizationFlow;
