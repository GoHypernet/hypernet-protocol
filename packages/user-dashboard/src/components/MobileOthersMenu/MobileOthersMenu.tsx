import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { pathToRegexp } from "path-to-regexp";
import {
  Box,
  Divider,
  IconButton,
  SwipeableDrawer,
  Typography,
  List,
  ListItem,
} from "@material-ui/core";
import { Menu as MenuIcon, Close as CloseIcon } from "@material-ui/icons";

import { useStyles } from "@user-dashboard/components/MobileOthersMenu/MobileOthersMenu.style";
import { routes } from "@user-dashboard/containers/Router/Router.routes";
import { useLayoutContext, useStoreContext } from "@web-integration/contexts";

const Header: React.FC = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const history = useHistory();

  const { hypernetWebIntegration } = useStoreContext();
  const { handleError } = useLayoutContext();

  const [isSideBardOpen, setIsSideBardOpen] = React.useState<boolean>(false);

  useEffect(() => {
    if (isSideBardOpen) {
      setTimeout(() => {
        hypernetWebIntegration.webUIClient
          .renderConnectedAccountWidget({
            selector: "connected-account-widget-wrapper-mobile",
          })
          .mapErr(handleError);
      }, 0);
    }
  }, [isSideBardOpen]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsSideBardOpen(true);
  };

  const isPathMatchRequestedUrl: (path: string) => boolean = (path: string) =>
    !!pathToRegexp(path).exec(pathname);

  const handleCloseSidebar = () => {
    setIsSideBardOpen(false);
  };

  return (
    <Box>
      <IconButton
        className={classes.iconButton}
        aria-label="menu-icon"
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        anchor="right"
        open={isSideBardOpen}
        onClose={handleCloseSidebar}
        onOpen={() => {}}
      >
        <Box className={classes.drawerContainer}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            className={classes.header}
          >
            <IconButton aria-label="close" onClick={handleCloseSidebar}>
              <CloseIcon className={classes.headerIcon} />
            </IconButton>
          </Box>
          <Typography variant="h6" color="textPrimary">
            Wallet Connected
          </Typography>
          <Box id="connected-account-widget-wrapper-mobile" />
          <Divider className={classes.divider} />
          <List className={classes.list}>
            {routes.map((route, index) =>
              route.isHeaderItem ? (
                <ListItem
                  key={index}
                  className={`${classes.listItem} ${
                    isPathMatchRequestedUrl(route.path)
                      ? classes.activeListItem
                      : classes.inactiveListItem
                  }`}
                  onClick={() => {
                    history.push(route.path);
                    handleCloseSidebar();
                  }}
                >
                  <Typography variant="h4" color="textPrimary">
                    {route.name}
                  </Typography>
                </ListItem>
              ) : null,
            )}
          </List>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
};

export default Header;
