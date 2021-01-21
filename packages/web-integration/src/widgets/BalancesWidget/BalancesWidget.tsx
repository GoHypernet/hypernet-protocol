import * as React from "react";
import { StoreContext } from "../../contexts";

const BalancesWidget: React.FC = () => {
  const { balances } = React.useContext(StoreContext);
  console.log("balances: ", balances);
  return (
    <div>
      <h2>here are your balances: </h2>
      {balances.map((balance, index) => (
        <div>
          <h3>balance {index + 1}: </h3>
          <ul>
            <li>assetAddress: {balance.assetAddress}</li>
            <li>freeAmount: {balance.freeAmount}</li>
            <li>lockedAmount: {balance.lockedAmount}</li>
            <li>totalAmount: {balance.totalAmount}</li>
          </ul>
          <br />
        </div>
      ))}
    </div>
  );
};

export default BalancesWidget;
