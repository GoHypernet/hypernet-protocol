import * as H from "history";
import React from "react";
import { Route, Switch } from "react-router-dom";

import { routes } from "@user-dashboard/containers/Router/Router.routes";

interface IRouter {
  history?: H.History;
}

const Router: React.FC<IRouter> = ({ history }: IRouter) => {
  return (
    <Switch>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          component={route.component}
          exact
        />
      ))}
    </Switch>
  );
};

export default Router;
