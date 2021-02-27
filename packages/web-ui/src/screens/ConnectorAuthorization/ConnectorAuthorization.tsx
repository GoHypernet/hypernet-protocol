import React, { useEffect } from "react";
import Button from "../../components/Button";
import { AssetBalance } from "@hypernetlabs/hypernet-core";
import BalanceList from "../../components/BalanceList";
import styles from "./ConnectorAuthorization.style";

interface IConnectorAuthorization {
  balances: AssetBalance[];
  onAuthorizeClick: () => void;
  connectorName?: string;
  connectorLogoUrl?: string;
}

const ConnectorAuthorization: React.FC<IConnectorAuthorization> = (props: IConnectorAuthorization) => {
  const { balances, onAuthorizeClick, connectorName, connectorLogoUrl } = props;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.imageContainer}>
          <img width="40" src={connectorLogoUrl} />
          <div style={styles.connectorName}>{connectorName}</div>
        </div>
      </div>
      <div style={styles.balancesWrapper}>
        <div style={styles.balancesLabel}>Your Balances</div>
        <BalanceList balances={balances} />
      </div>
      <Button
        label="Authorize"
        onClick={onAuthorizeClick}
        fullWidth={true}
        bgColor="linear-gradient(98deg, rgba(0,120,255,1) 0%, rgba(126,0,255,1) 100%)"
      />
      <div style={styles.account}>
        <a style={styles.accountLink} href="https://hypernetlabs.io/" target="_blank">
          View your Hypernet account.
        </a>
      </div>
    </div>
  );
};

export default ConnectorAuthorization;
