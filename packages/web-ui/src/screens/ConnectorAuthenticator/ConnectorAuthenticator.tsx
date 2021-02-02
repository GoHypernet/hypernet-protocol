import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { IBalanceList } from "../../interfaces";
import Button from "../../components/Button";
import BalanceList from "../../components/BalanceList";

const modalRoot: HTMLElement = document.createElement("div");
modalRoot.id = "__hypernet-protocol-modal-root__";
document.body.appendChild(modalRoot);

interface IConnectorAuthenticator {
  balances: IBalanceList[];
  confirmCallback: () => void;
}

const ConnectorAuthenticator: React.FC<IConnectorAuthenticator> = (props: IConnectorAuthenticator) => {
  const { balances, confirmCallback } = props;

  return (
    <div>
      <h2>here is ConnectorAuthenticator</h2>
      {/* <BalanceList balances={balances} /> */}
      <Button label="connect to galileo" onClick={confirmCallback} />
    </div>
  );
};

export const renderConnectorAuthenticatorScreen = (
  connector: string,
  balances: IBalanceList[],
  confirmCallback: () => void,
) => {
  const element = document.getElementById("__hypernet-protocol-iframe-connector-authentication__");
  ReactDOM.render(<ConnectorAuthenticator balances={balances} confirmCallback={confirmCallback} />, element);
};

export default renderConnectorAuthenticatorScreen;
