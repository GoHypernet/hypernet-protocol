import React, { useEffect } from "react";
import Button from "../../components/Button";
import { AssetBalance } from "@hypernetlabs/hypernet-core";
import BalanceList from "../../components/BalanceList";

interface IConnectorAuthorization {
  balances: AssetBalance[];
  onAuthorizeClick: () => void;
  connectorName?: string;
  connectorLogoUrl?: string;
}

const ConnectorAuthorization: React.FC<IConnectorAuthorization> = (props: IConnectorAuthorization) => {
  const { balances, onAuthorizeClick, connectorName } = props;

  return (
    <div>
      <h2>here is {connectorName} authorization</h2>
      <BalanceList balances={balances} />
      <Button label="connect to galileo" onClick={onAuthorizeClick} />
    </div>
  );
};

export default ConnectorAuthorization;
