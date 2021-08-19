import { FC } from "react";

import Summary from "@user-dashboard/pages/Summary";
import DepositAndWithdraw from "@user-dashboard/pages/DepositAndWithdraw";
import BalancesSummary from "@user-dashboard/pages/BalancesSummary";

interface IRoute {
  path: string;
  component: FC;
  name: string;
}

export const routes: IRoute[] = [
  {
    path: "/",
    component: Summary,
    name: "Summary",
  },
  {
    path: "/deposit-and-withdraw",
    component: DepositAndWithdraw,
    name: "deposit & withdraw",
  },
  {
    path: "/balances",
    component: BalancesSummary,
    name: "Balances",
  },
];
