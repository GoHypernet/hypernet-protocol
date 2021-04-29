import { ConnectorAuthorization, SucessContent } from "@hypernetlabs/web-ui";
import { EStatusColor } from "@hypernetlabs/web-ui/src/theme";
import React, { useContext, useEffect } from "react";

import { LayoutContext, StoreContext } from "@web-integration/contexts";
import { useBalances } from "@web-integration/hooks";
import { IConnectorAuthorizationFlowParams } from "@web-integration/interfaces/app/IHypernetWebIntegration";

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
    <ConnectorAuthorization
      balances={balances}
      connectorName={connectorName}
      connectorLogoUrl={connectorLogoUrl}
      onAuthorizeClick={handleMerchantAuthorization}
    />
  );
};

export default ConnectorAuthorizationFlow;
