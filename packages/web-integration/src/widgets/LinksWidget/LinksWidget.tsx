import React from "react";
import { BalanceList } from "@hypernetlabs/web-ui";
import { useBalances } from "../../hooks";

const LinksWidget: React.FC = () => {
  const { balances } = useBalances();
  console.log("balances123: ", balances);

  // put some logic if needed

  return (
    <div>
      <h2>here are your LinksWidget: </h2>
      <BalanceList balances={balances} />
    </div>
  );
};

export default LinksWidget;
