import { FC } from "react";

import Proposals from "@governance-app/pages/Proposals";
import CreateProposal from "@web-integration/pages/CreateProposal";

interface IRoute {
  path: string;
  component: FC;
  name: string;
  menuItem: boolean;
}

export const PATH = {
  Proposals: "/",
  CreateProposal: "/create-proposal",
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
];
