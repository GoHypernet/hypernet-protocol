import React from "react";
import { BalanceList } from "@hypernetlabs/web-ui";
import { useBalances } from "@web-integration/hooks";

const BalancesWidget: React.FC = () => {
  const { balances } = useBalances();
  console.log("balances: ", balances);

  // put some logic if needed

  return (
    <div>
      <h2>here are your balances: </h2>
      <BalanceList balances={balances} />
    </div>
  );
};

export default BalancesWidget;
