import React from "react";
import { AssetBalance } from "@hypernetlabs/hypernet-core";

interface BalanceListProps {
  balances?: AssetBalance[];
}

const BalanceList: React.FC<BalanceListProps> = (props: BalanceListProps) => {
  const { balances } = props;

  return (
    <div>
      {balances?.map((balance, index) => (
        <div key={index}>
          <h3>balance {index + 1}: </h3>
          <ul>
            <li>assetAddress: {balance.assetAddresss}</li>
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

export default BalanceList;
