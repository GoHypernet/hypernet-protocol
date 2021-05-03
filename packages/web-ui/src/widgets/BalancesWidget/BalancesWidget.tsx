import { BalanceList } from "@web-ui/components";
import React from "react";

import { useBalances } from "@web-ui/hooks";

const BalancesWidget: React.FC = () => {
  const { balances } = useBalances();
  console.log("balances: ", balances);

  // put some logic if needed

  return <BalanceList balances={balances} />;
};

export default BalancesWidget;
