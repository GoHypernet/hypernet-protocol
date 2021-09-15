import { Box } from "@material-ui/core";
import { pathToRegexp } from "path-to-regexp";
import React from "react";
import { Link, useLocation } from "react-router-dom";

import { useStyles } from "@user-dashboard/components/Header/Header.style";
import { routes } from "@user-dashboard/containers/Router/Router.routes";

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
          src="https://res.cloudinary.com/dqueufbs7/image/upload/v1623464753/images/HNPLogo.png"
          alt=""
        />
      </Box>
      <Box className={classes.menuWrapper}>
        {routes.map((route, index) => (
          <Box
            className={`${classes.menuItem} ${
              isPathMatchRequestedUrl(route.path)
                ? classes.activeMenuItem
                : classes.inactiveMenuItem
            }`}
            key={index}
          >
            <Link to={route.path}>{route.name}</Link>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Header;
