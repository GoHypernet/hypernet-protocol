import { FC } from "react";

import Summary from "@user-dashboard/pages/Summary";
import DepositAndWithdraw from "@user-dashboard/pages/DepositAndWithdraw";
import BalancesSummary from "@user-dashboard/pages/BalancesSummary";
import Gateways from "@user-dashboard/pages/Gateways";
import Proposals from "@user-dashboard/pages/Governance/Proposals";
import ProposalDetail from "@user-dashboard/pages/Governance/ProposalDetail";
import ProposalCreate from "@user-dashboard/pages/Governance/ProposalCreate";
import RegistryList from "@web-integration/pages/Governance/RegistryList";
import RegistryEntryList from "@web-integration/pages/Governance/RegistryEntryList";

interface IRoute {
  path: string;
  component: FC;
  name: string;
  isHeaderItem?: boolean;
}

export const routes: IRoute[] = [
  {
    path: "/",
    component: Summary,
    name: "Summary",
    isHeaderItem: true,
  },
  {
    path: "/deposit-and-withdraw",
    component: DepositAndWithdraw,
    name: "deposit & withdraw",
    isHeaderItem: true,
  },
  {
    path: "/balances",
    component: BalancesSummary,
    name: "Balances",
    isHeaderItem: true,
  },
  {
    path: "/gateways",
    component: Gateways,
    name: "Gateways",
    isHeaderItem: true,
  },
  {
    path: "/registries",
    component: RegistryList,
    name: "Registries",
    isHeaderItem: true,
  },
  {
    path: "/registries/:registryName/entries",
    component: RegistryEntryList,
    name: "Registry Entries",
  },
  {
    path: "/registries/:registryName/entries/:registryEntry",
    component: RegistryEntryList,
    name: "Registry Entry Detail",
  },
  {
    path: "/proposals",
    component: Proposals,
    name: "Proposals",
    isHeaderItem: true,
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
