import { FC } from "react";

import Vote from "@governance-app/pages/Vote";

interface IRoute {
  path: string;
  component: FC;
  name: string;
}

export const routes: IRoute[] = [
  {
    path: "/",
    component: Vote,
    name: "Vote",
  },
];
