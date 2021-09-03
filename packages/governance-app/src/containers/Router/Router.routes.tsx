import { FC } from "react";

import Proposals from "@governance-app/pages/Proposals";
import CreateProposal from "@governance-app/pages/CreateProposal";
import ProposalDetail from "@governance-app/pages/ProposalDetail";

interface IRoute {
  path: string;
  component: FC;
  name: string;
  menuItem: boolean;
}

export const PATH = {
  Proposals: "/",
  CreateProposal: "/create-proposal",
  ProposalDetail: '/vote/:id',
};

export const routes: IRoute[] = [
  {
    path: PATH.Proposals,
    component: Proposals,
    name: "Vote",
    menuItem: true,
  },
  {
    path: PATH.CreateProposal,
    component: CreateProposal,
    name: "Create Proposal",
    menuItem: false,
  },
  {
    path: PATH.ProposalDetail,
    component: ProposalDetail,
    name: "Proposal Detail",
    menuItem: false,
  },
];
