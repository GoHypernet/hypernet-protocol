import { Box, Hidden, Typography } from "@material-ui/core";
import { pathToRegexp } from "path-to-regexp";
import React, { useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import MobileOthersMenu from "@user-dashboard/components/MobileOthersMenu";

import { useStyles } from "@user-dashboard/components/Header/Header.style";
import { routes } from "@user-dashboard/containers/Router/Router.routes";
import { useLayoutContext, useStoreContext } from "@web-integration/contexts";

const Header: React.FC = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const history = useHistory();

  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();

  useEffect(() => {
    hypernetWebIntegration.webUIClient
      .renderConnectedAccountWidget({
        selector: "connected-account-widget-wrapper",
      })
      .mapErr(handleError);
  }, []);

  useEffect(() => {
    hypernetWebIntegration.webUIClient
      .renderVotingPowerWidget({
        selector: "voting-power-widget-wrapper",
      })
      .mapErr(handleError);
  }, []);

  useEffect(() => {
    hypernetWebIntegration.webUIClient
      .renderConnectedAccountWidget({
        selector: "hypertoken-balance-widget-wrapper",
      })
      .mapErr(handleError);
  }, []);

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
      <Hidden mdDown>
        <Box className={classes.menuWrapper}>
          {routes.map((route, index) =>
            route.isHeaderItem ? (
              <Box
                className={`${classes.menuItem} ${
                  isPathMatchRequestedUrl(route.path)
                    ? classes.activeMenuItem
                    : classes.inactiveMenuItem
                }`}
                key={index}
                onClick={() => {
                  history.push(route.path);
                }}
              >
                <Typography variant="body2">{route.name}</Typography>
              </Box>
            ) : null,
          )}
        </Box>
      </Hidden>
      <Box className={classes.rightContent}>
        <Box
          className={classes.widgetWrapper}
          id="voting-power-widget-wrapper"
        />
        <Box
          className={classes.widgetWrapper}
          id="connected-account-widget-wrapper"
        />
        <Box
          className={classes.widgetWrapper}
          id="hypertoken-balance-widget-wrapper"
        />
        <Hidden lgUp>
          <MobileOthersMenu />
        </Hidden>
      </Box>
    </Box>
  );
};

export default Header;
