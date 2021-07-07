import { FC } from "react";

import DepositAndWithdraw from "@user-dashboard/pages/DepositAndWithdraw";
import Summary from "@user-dashboard/pages/Summary";

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
];
