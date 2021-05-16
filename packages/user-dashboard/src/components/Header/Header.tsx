import { routes } from "@user-dashboard/containers/Router/Router.routes";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { pathToRegexp } from "path-to-regexp";

import useStyles from "./Header.style";

const Header: React.FC = () => {
  const classes = useStyles();
  const { pathname } = useLocation();

  const isPathMatchRequestedUrl: (path: string) => boolean = (path: string) =>
    !!pathToRegexp(path).exec(pathname);

  return (
    <div className={classes.headerWrapper}>
      <div className={classes.logoWrapper}>
        <img
          className={classes.logo}
          src={require("@user-dashboard/assets/images/HNPLogo.png").default}
          alt=""
        />
      </div>
      <div className={classes.menuWrapper}>
        {routes.map((route, index) => (
          <div
            className={`${classes.menuItem} ${
              isPathMatchRequestedUrl(route.path)
                ? classes.activeMenuItem
                : classes.inactiveMenuItem
            }`}
            key={index}
          >
            <Link to={route.path}>{route.name}</Link>
          </div>
        ))}
        <div className={`${classes.menuItem} ${classes.inactiveMenuItem}`}>
          <a href="https://galileo-forum.hypernetlabs.io/" target="_blank">
            COMMUNITY
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
