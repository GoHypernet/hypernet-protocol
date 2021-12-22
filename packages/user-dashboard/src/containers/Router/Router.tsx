import React from "react";
import { Route, Switch } from "react-router-dom";

import {
  IRouteConfig,
  routeConfig,
} from "@user-dashboard/containers/Router/Router.routes";

interface IRouter {}

const addRoutes = (routeConfig: IRouteConfig) => {
  return (
    <>
      {Object.values(routeConfig).map((route) => (
        <>
          <Route
            key={route.path}
            path={route.path}
            component={route.Component}
            exact
          />
          {route.subRoutes && addRoutes(route.subRoutes)}
        </>
      ))}
    </>
  );
};

const Router: React.FC<IRouter> = () => {
  return <Switch>{addRoutes(routeConfig)}</Switch>;
};

export default Router;
