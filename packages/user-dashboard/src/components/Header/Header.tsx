import { routes } from "@user-dashboard/containers/Router/Router.routes";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { pathToRegexp } from "path-to-regexp";
import { Box } from "@material-ui/core";

import { useStyles } from "@user-dashboard/components/Header/Header.style";

const Header: React.FC = () => {
  const classes = useStyles();
  const { pathname } = useLocation();

  const isPathMatchRequestedUrl: (path: string) => boolean = (path: string) =>
    !!pathToRegexp(path).exec(pathname);

  return (
    <Box className={classes.headerWrapper}>
      <Box className={classes.logoWrapper}>
        <img
          className={classes.logo}
          src={require("@user-dashboard/assets/images/HNPLogo.png").default}
          alt=""
        />
      </Box>
      <Box className={classes.menuWrapper}>
        {routes.map((route, index) => (
          <Box
            className={`${classes.menuItem} ${isPathMatchRequestedUrl(route.path)
              ? classes.activeMenuItem
              : classes.inactiveMenuItem
              }`}
            key={index}
          >
            <Link to={route.path}>{route.name}</Link>
          </Box>
        ))}
        <Box className={`${classes.menuItem} ${classes.inactiveMenuItem}`}>
          <a href="https://galileo-forum.hypernetlabs.io/" target="_blank">
            COMMUNITY
          </a>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
