import { FC } from "react";

import Summary from "@user-dashboard/pages/Summary";
import SendAndReceive from "@user-dashboard/pages/SendAndReceive";

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
    path: "/send-and-recieve",
    component: SendAndReceive,
    name: "send & receıve",
  },
];
