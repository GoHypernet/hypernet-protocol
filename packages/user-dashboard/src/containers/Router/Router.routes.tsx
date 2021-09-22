import { FC } from "react";

import Summary from "@user-dashboard/pages/Summary";
import DepositAndWithdraw from "@user-dashboard/pages/DepositAndWithdraw";
import BalancesSummary from "@user-dashboard/pages/BalancesSummary";
import Gateways from "@user-dashboard/pages/Gateways";
import Proposals from "@user-dashboard/pages/Governance/Proposals";
import ProposalDetail from "@user-dashboard/pages/Governance/ProposalDetail";
import ProposalCreate from "@user-dashboard/pages/Governance/ProposalCreate";

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
  {
    path: "/gateways",
    component: Gateways,
    name: "Gateways",
  },
  {
    path: "/proposals",
    component: Proposals,
    name: "Proposals",
  },
  {
    path: "/proposals/:proposalId",
    component: ProposalDetail,
    name: "Proposal Detail",
  },
  {
    path: "/proposal-create",
    component: ProposalCreate,
    name: "Proposal",
  },
];
