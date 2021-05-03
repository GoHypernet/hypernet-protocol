import {
  ModalHeader,
  ModalFooter,
  SucessContent,
  BalanceList,
  Button,
} from "@web-ui/components";
import { EStatusColor } from "@web-ui/theme";
import React, { useContext, useEffect } from "react";

import { LayoutContext, StoreContext } from "@web-ui/contexts";
import { useBalances } from "@web-ui/hooks";
import { IConnectorAuthorizationFlowParams } from "@web-ui/interfaces";
import useStyles from "./ConnectorAuthorizationFlow.style";

const ConnectorAuthorizationFlow: React.FC<IConnectorAuthorizationFlowParams> = (
  props: IConnectorAuthorizationFlowParams,
) => {
  const {
    connectorUrl,
    connectorName = "Hypernet",
    connectorLogoUrl = "https://res.cloudinary.com/dqueufbs7/image/upload/v1614369421/images/Screen_Shot_2021-02-26_at_22.56.34.png",
  } = props;
  const { balances } = useBalances();
  const { proxy } = useContext(StoreContext);
  const { setModalWidth, setModalStatus, modalStatus, closeModal } = useContext(
    LayoutContext,
  );
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

  return modalStatus === EStatusColor.SUCCESS ? (
    <SucessContent
      label="Success!"
      info="You have successfully connected to Galileo.
    You can now start making payments and
    transactions."
      onOkay={() => closeModal()}
    />
  ) : (
    <div className={classes.container}>
      <ModalHeader />
      <div className={classes.balancesWrapper}>
        <div className={classes.balancesLabel}>Your Balances</div>
        <BalanceList balances={balances} />
      </div>
      <Button
        label="Authorize"
        onClick={handleMerchantAuthorization}
        fullWidth={true}
        bgColor="linear-gradient(98deg, rgba(0,120,255,1) 0%, rgba(126,0,255,1) 100%)"
      />
      <ModalFooter />
    </div>
  );
};

export default ConnectorAuthorizationFlow;