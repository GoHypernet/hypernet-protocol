import React, { useContext } from "react";
import { ConnectorAuthorization } from "@hypernetlabs/web-ui";
import { useBalances } from "@web-integration/hooks";
import { StoreContext } from "@web-integration/contexts";
import { IConnectorAuthorizationFlowParams } from "@web-integration/interfaces/app/IHypernetWebIntegration";

const ConnectorAuthorizationFlow: React.FC<IConnectorAuthorizationFlowParams> = (
  props: IConnectorAuthorizationFlowParams,
) => {
  const { connectorUrl, connectorName, connectorLogoUrl } = props;
  const { balances } = useBalances();
  const { proxy } = useContext(StoreContext);

  const handleMerchantAuthorization = () => {
    proxy.authorizeMerchant(connectorUrl).match(
      () => {
        console.log("yo, all good show the success alert");
      },
      (err) => {
        console.log("yo stop, we have some error");
      },
    );
  };

  return (
    <div>
      <ConnectorAuthorization
        balances={balances}
        connectorName={connectorName}
        connectorLogoUrl={connectorLogoUrl}
        onAuthorizeClick={handleMerchantAuthorization}
      />
    </div>
  );
};

export default ConnectorAuthorizationFlow;
