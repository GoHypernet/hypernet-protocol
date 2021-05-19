import React, { useEffect } from "react";
import { Box } from "@material-ui/core";

import { ModalHeader, ModalFooter, Button } from "@web-ui/components";
import { useLayoutContext, useStoreContext } from "@web-ui/contexts";
import { useStyles } from "@web-ui/flows/ConnectorAuthorizationFlow/ConnectorAuthorizationFlow.style";
import { useBalances } from "@web-ui/hooks";
import { IConnectorAuthorizationFlowParams } from "@web-ui/interfaces";
import { EStatusColor } from "@web-ui/theme";
import BalancesWidget from "@web-ui/widgets/BalancesWidget/BalancesWidget";

const ConnectorAuthorizationFlow: React.FC<IConnectorAuthorizationFlowParams> = (
  props: IConnectorAuthorizationFlowParams,
) => {
  const { connectorUrl } = props;
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
    <Box className={classes.container}>
      <ModalHeader />
      {balances?.length ? (
        <BalancesWidget />
      ) : (
        <Box className={classes.balancesEmptyLabel}>You are one step away!</Box>
      )}
      <Button
        label="Authorize Merchant"
        onClick={handleMerchantAuthorization}
        fullWidth={true}
        bgColor="linear-gradient(98deg, rgba(0,120,255,1) 0%, rgba(126,0,255,1) 100%)"
      />
      <ModalFooter />
    </Box>
  );
};

export default ConnectorAuthorizationFlow;
