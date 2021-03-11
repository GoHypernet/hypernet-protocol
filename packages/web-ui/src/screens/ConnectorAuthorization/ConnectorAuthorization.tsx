import React, { useEffect } from "react";
import Button from "../../components/Button";
import { AssetBalance } from "@hypernetlabs/hypernet-core";
import BalanceList from "../../components/BalanceList";
import useStyles from "./ConnectorAuthorization.style";

interface IConnectorAuthorization {
  balances: AssetBalance[];
  onAuthorizeClick: () => void;
  connectorName?: string;
  connectorLogoUrl?: string;
}

const ConnectorAuthorization: React.FC<IConnectorAuthorization> = (props: IConnectorAuthorization) => {
  const { balances, onAuthorizeClick, connectorName, connectorLogoUrl } = props;
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.imageContainer}>
          <img width="40" src={connectorLogoUrl} />
          <div className={classes.connectorName}>{connectorName}</div>
        </div>
      </div>
      <div className={classes.balancesWrapper}>
        <div className={classes.balancesLabel}>Your Balances</div>
        <BalanceList balances={balances} />
      </div>
      <Button
        label="Authorize"
        onClick={onAuthorizeClick}
        fullWidth={true}
        bgColor="linear-gradient(98deg, rgba(0,120,255,1) 0%, rgba(126,0,255,1) 100%)"
      />
      <div className={classes.account}>
        <a className={classes.accountLink} href="https://hypernetlabs.io/" target="_blank">
          View your Hypernet account.
        </a>
      </div>
    </div>
  );
};

export default ConnectorAuthorization;
