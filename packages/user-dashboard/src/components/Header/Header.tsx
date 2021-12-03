import {
  Box,
  Hidden,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { pathToRegexp } from "path-to-regexp";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import MobileOthersMenu from "@user-dashboard/components/MobileOthersMenu";

import { useStyles } from "@user-dashboard/components/Header/Header.style";
import { routes } from "@user-dashboard/containers/Router/Router.routes";
import { useLayoutContext, useStoreContext } from "@web-integration/contexts";

const Header: React.FC = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const history = useHistory();

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"), {
    noSsr: true,
  });

  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();

  useEffect(() => {
    hypernetWebIntegration.webUIClient
      .renderVotingPowerWidget({
        selector: "voting-power-widget-wrapper",
      })
      .mapErr(handleError);
  }, []);

  useEffect(() => {
    hypernetWebIntegration.webUIClient
      .renderHypertokenBalanceWidget({
        selector: "hypertoken-balance-widget-wrapper",
      })
      .mapErr(handleError);
  }, []);

  useEffect(() => {
    if (isLargeScreen) {
      hypernetWebIntegration.webUIClient
        .renderConnectedAccountWidget({
          selector: "connected-account-widget-wrapper",
        })
        .mapErr(handleError);
    }
  }, [isLargeScreen]);

  const isPathMatchRequestedUrl: (path: string) => boolean = (path: string) =>
    !!pathToRegexp(path).exec(pathname);

  return (
    <Box className={classes.headerWrapper}>
      <Box className={classes.logoWrapper}>
        <Hidden mdDown>
          <img
            className={classes.logo}
            src="https://storage.googleapis.com/hypernetlabs-public-assets/hypernet-protocol/hpnlogo-purple.png"
            alt=""
          />
        </Hidden>
        <Hidden lgUp>
          <img
            className={classes.smallLogo}
            src="https://storage.googleapis.com/hypernetlabs-public-assets/hypernet-protocol/hypernet-logo-dark.svg"
            alt=""
          />
        </Hidden>
      </Box>
      <Hidden smDown>
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
          id="hypertoken-balance-widget-wrapper"
        />

        {isLargeScreen ? (
          <Box
            className={classes.widgetWrapper}
            id="connected-account-widget-wrapper"
          />
        ) : (
          <MobileOthersMenu />
        )}
      </Box>
    </Box>
  );
};

export default Header;
