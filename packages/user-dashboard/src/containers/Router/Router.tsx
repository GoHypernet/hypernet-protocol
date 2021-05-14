import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { routes } from "@user-dashboard/containers/Router/Router.routes";
import Header from "@user-dashboard/components/Header";
import * as H from "history";

interface IRouter {
  history?: H.History;
}

const Router: React.FC<IRouter> = ({ history }: IRouter) => {
  return (
    <BrowserRouter>
      <Header />
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
    </BrowserRouter>
  );
};

export default Router;
