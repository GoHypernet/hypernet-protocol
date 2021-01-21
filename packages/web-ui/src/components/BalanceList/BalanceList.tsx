import React from "react";
import { IBalanceList } from "../../interfaces";

interface BalanceListProps {
  balances?: IBalanceList[];
}

const BalanceList: React.FC<BalanceListProps> = (props: BalanceListProps) => {
  const { balances } = props;

  return (
    <div>
      {balances?.map((balance, index) => (
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

export default BalanceList;
