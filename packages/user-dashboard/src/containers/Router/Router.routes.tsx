import { FC } from "react";

import Deposit from "@user-dashboard/pages/Deposit";
import Withdraw from "@user-dashboard/pages/Withdraw";
import BalancesSummary from "@user-dashboard/pages/BalancesSummary";
import Proposals from "@user-dashboard/pages/Governance/Proposals";
import ProposalDetail from "@user-dashboard/pages/Governance/ProposalDetail";
import ProposalCreate from "@user-dashboard/pages/Governance/ProposalCreate";
import RegistryList from "@user-dashboard/pages/Governance/RegistryList";
import RegistryEntryList from "@user-dashboard/pages/Governance/RegistryEntryList";
import RegistryEntryDetail from "@user-dashboard/pages/Governance/RegistryEntryDetail";
import RegistryDetail from "@user-dashboard/pages/Governance/RegistryDetail";
import PaymentHistory from "@user-dashboard/pages/PaymentHistory";
import LazyMintingRequests from "@user-dashboard/pages/Governance/LazyMintingRequests";

export interface IRouteConfig {
  [x: string]: IRouteItem;
}

export interface IRouteItem {
  Component: React.ComponentType<any>;
  path: string;
  name: string;
  subRoutes?: IRouteConfig;
  isHeaderItem?: boolean;
  isSidebarItem?: boolean;
}

export enum ROUTES {
  PAYMENTS = "/payments",
  PAYMENT_HISTORY = "/payments/payment-history",
  DEPOSIT = "/payments/deposit-and-withdraw",
  WITHDRAW = "/payments/withdraw",
  BALANCES = "/payments/balances",
  REGISTRIES = "/registries",
  REGISTRY_DEFAIL = "/registries/:registryName",
  REGISTRY_ENTRY_LIST = "/registries/:registryName/entries",
  REGISTRY_ENTRY_DETAIL = "/registries/:registryName/entries/:entryTokenId",
  PROPOSALS = "/proposals",
  PROPOSAL_DETAIL = "/proposals/:proposalId",
  PROPOSAL_CREATE = "/proposals/create",
  LAZY_MINTING_REQUEST = "/registries/lazy-minting-requests",
  ROOT = "/",
}

export const routeConfig: IRouteConfig = {
  registries: {
    path: ROUTES.ROOT,
    Component: RegistryList,
    name: "Registries",
    isHeaderItem: true,
  },
  proposals: {
    path: ROUTES.PROPOSALS,
    Component: Proposals,
    name: "Governance",
    isHeaderItem: true,
  },
  payments: {
    path: ROUTES.PAYMENTS,
    Component: PaymentHistory,
    name: "Payments",
    isHeaderItem: true,
    subRoutes: {
      paymentHistory: {
        path: ROUTES.PAYMENT_HISTORY,
        Component: PaymentHistory,
        name: "Payment History",
        isSidebarItem: true,
      },
      deposit: {
        path: ROUTES.DEPOSIT,
        Component: Deposit,
        name: "Deposit",
        isSidebarItem: true,
      },
      withdraw: {
        path: ROUTES.WITHDRAW,
        Component: Withdraw,
        name: "Withdraw",
        isSidebarItem: true,
      },
      balances: {
        path: ROUTES.BALANCES,
        Component: BalancesSummary,
        name: "Balances",
        isSidebarItem: true,
      },
    },
  },
  proposalDetail: {
    path: ROUTES.PROPOSAL_DETAIL,
    Component: ProposalDetail,
    name: "Proposal Detail",
  },
  proposalCreate: {
    path: ROUTES.PROPOSAL_CREATE,
    Component: ProposalCreate,
    name: "Proposal",
  },
  lazyMintingRequests: {
    path: ROUTES.LAZY_MINTING_REQUEST,
    Component: LazyMintingRequests,
    name: "Lazy Minting Requests",
    isHeaderItem: false,
  },
  registryDetail: {
    path: ROUTES.REGISTRY_DEFAIL,
    Component: RegistryDetail,
    name: "Registry Detail",
    isHeaderItem: false,
  },
  registryEntryList: {
    path: ROUTES.REGISTRY_ENTRY_LIST,
    Component: RegistryEntryList,
    name: "Registry Entries",
  },
  registryEntryDetail: {
    path: ROUTES.REGISTRY_ENTRY_DETAIL,
    Component: RegistryEntryDetail,
    name: "Registry Entry Detail",
  },
};
