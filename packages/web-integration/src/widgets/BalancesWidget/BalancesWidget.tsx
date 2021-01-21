import React from "react";
import { StoreContext } from "../../contexts";
import { BalanceList } from "@hypernetlabs/web-ui";

const BalancesWidget: React.FC = () => {
  const { balances } = React.useContext(StoreContext);
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
