import { Box } from "@material-ui/core";
import { useLayoutContext, useStoreContext } from "@web-ui/contexts";
import { IConnectorAuthorizationFlowParams } from "@web-ui/interfaces";
import React, { useEffect } from "react";

import { ModalHeader, ModalFooter, Button } from "@web-ui/components";
import { useStyles } from "@web-ui/flows/ConnectorAuthorizationFlow/ConnectorAuthorizationFlow.style";
import { useBalances } from "@web-ui/hooks";
import { EStatusColor } from "@web-ui/theme";
import BalancesWidget from "@web-ui/widgets/BalancesWidget/BalancesWidget";

const ConnectorAuthorizationFlow: React.FC<IConnectorAuthorizationFlowParams> = (
  props: IConnectorAuthorizationFlowParams,
) => {
  const { connectorUrl } = props;
  const { balances } = useBalances();
  const { coreProxy } = useStoreContext();
  const { setModalWidth, setModalStatus, closeModal } = useLayoutContext();
  const classes = useStyles();

  useEffect(() => {
    coreProxy.onMerchantAuthorized.subscribe(() => {
      closeModal();
    });

    // Destroy self modal if merchant modal is visible.
    const iframeElements = document.getElementsByName(
      "hypernet-core-merchant-connector-iframe",
    );
    if (iframeElements.length && iframeElements[0].style.display === "block") {
      closeModal();
    }

    coreProxy.onAuthorizedMerchantActivationFailed.subscribe(() => {
      // show some error
      console.log("onAuthorizedMerchantActivationFailed");
    });
  }, []);

  const handleMerchantAuthorization = () => {
    coreProxy.authorizeMerchant(connectorUrl).match(
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
        <Box>
          <Box className={classes.balancesLabel}>Your Balances</Box>
          <BalancesWidget />
        </Box>
      ) : (
        <Box className={classes.balancesEmptyLabel}>You are one step away!</Box>
      )}
      <Button
        label="Authorize Gateway"
        onClick={handleMerchantAuthorization}
        fullWidth={true}
        bgColor="linear-gradient(98deg, rgba(0,120,255,1) 0%, rgba(126,0,255,1) 100%)"
      />
      <ModalFooter />
    </Box>
  );
};

export default ConnectorAuthorizationFlow;
