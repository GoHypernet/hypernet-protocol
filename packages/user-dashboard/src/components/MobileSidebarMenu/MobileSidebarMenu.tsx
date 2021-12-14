import React, { useEffect, useMemo } from "react";
import {
  Box,
  Divider,
  IconButton,
  SwipeableDrawer,
  Typography,
  List,
} from "@material-ui/core";
import { Menu as MenuIcon, Close as CloseIcon } from "@material-ui/icons";

import SidebarItem from "@user-dashboard/components/SidebarItem";
import {
  IRouteConfig,
  IRouteItem,
  routeConfig,
} from "@user-dashboard/containers/Router/Router.routes";
import { ISidebarItem } from "@user-dashboard/components/SidebarItem/SidebarItem.interface";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";
import { useStyles } from "@user-dashboard/components/MobileSidebarMenu/MobileSidebarMenu.style";

const getSidebarItemText = ({ name, subRoutes, isHeaderItem }: IRouteItem) => {
  if (isHeaderItem || subRoutes?.length) {
    return name.toUpperCase();
  }

  return name;
};

const getMobileSidebarMenuConfig = (routeConfig?: IRouteConfig) => {
  return Object.values(routeConfig || {})
    .filter((item) => item?.isHeaderItem || item?.isSidebarItem)
    .map((item) => {
      const { path, subRoutes } = item;

      return {
        path,
        text: getSidebarItemText(item),
        subItems: subRoutes ? getMobileSidebarMenuConfig(subRoutes) : [],
      };
    });
};

const MobileSidebarMenu: React.FC = () => {
  const classes = useStyles();

  const { hypernetWebIntegration } = useStoreContext();
  const { handleError } = useLayoutContext();

  const [isSideBarOpen, setIsSideBarOpen] = React.useState<boolean>(false);

  useEffect(() => {
    if (isSideBarOpen) {
      setTimeout(() => {
        hypernetWebIntegration.webUIClient
          .renderConnectedAccountWidget({
            selector: "connected-account-widget-wrapper-mobile",
          })
          .mapErr(handleError);
      }, 0);
    }
  }, [isSideBarOpen]);

  const sideBarConfig: ISidebarItem[] = useMemo(() => {
    return getMobileSidebarMenuConfig(routeConfig);
  }, []);

  const toggleSidebar = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsSideBarOpen(!isSideBarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSideBarOpen(false);
  };

  return (
    <Box>
      <IconButton
        className={classes.iconButton}
        aria-label="menu-icon"
        onClick={toggleSidebar}
      >
        {isSideBarOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      <SwipeableDrawer
        anchor="right"
        PaperProps={{ className: classes.paper }}
        open={isSideBarOpen}
        onClose={handleCloseSidebar}
        onOpen={() => {}}
      >
        <Box className={classes.drawerContainer}>
          <Typography
            variant="body2"
            color="textPrimary"
            className={classes.walletConnectedLabel}
          >
            Wallet Connected
          </Typography>
          <Box id="connected-account-widget-wrapper-mobile" />
          <Divider className={classes.divider} />
          <List className={classes.list}>
            {sideBarConfig.map(({ text, path, subItems = [] }, index) => (
              <SidebarItem
                key={index}
                text={text}
                path={path}
                subItems={subItems}
              />
            ))}
          </List>
        </Box>
      </SwipeableDrawer>
    </Box>
  );
};

export default MobileSidebarMenu;
