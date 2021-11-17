import { FC } from "react";

import Summary from "@user-dashboard/pages/Summary";
import DepositAndWithdraw from "@user-dashboard/pages/DepositAndWithdraw";
import BalancesSummary from "@user-dashboard/pages/BalancesSummary";
import Proposals from "@user-dashboard/pages/Governance/Proposals";
import ProposalDetail from "@user-dashboard/pages/Governance/ProposalDetail";
import ProposalCreate from "@user-dashboard/pages/Governance/ProposalCreate";
import RegistryList from "@user-dashboard/pages/Governance/RegistryList";
import RegistryEntryList from "@user-dashboard/pages/Governance/RegistryEntryList";
import RegistryEntryDetail from "@user-dashboard/pages/Governance/RegistryEntryDetail";
import RegistryDetail from "@user-dashboard/pages/Governance/RegistryDetail";

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
    name: "Deposit & Withdraw",
    isHeaderItem: true,
  },
  {
    path: "/balances",
    component: BalancesSummary,
    name: "Balances",
    isHeaderItem: true,
  },
  {
    path: "/registries",
    component: RegistryList,
    name: "Registries",
    isHeaderItem: true,
  },
  {
    path: "/registries/:registryName",
    component: RegistryDetail,
    name: "Registry Detail",
    isHeaderItem: false,
  },
  {
    path: "/registries/:registryName/entries",
    component: RegistryEntryList,
    name: "Registry Entries",
  },
  {
    path: "/registries/:registryName/entries/:entryTokenId",
    component: RegistryEntryDetail,
    name: "Registry Entry Detail",
  },
  {
    path: "/proposals",
    component: Proposals,
    name: "Governance",
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
