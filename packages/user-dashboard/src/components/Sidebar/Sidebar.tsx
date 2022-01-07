import React, { useMemo } from "react";
import { useLocation } from "react-router";
import { Box, List, Drawer } from "@material-ui/core";

import {
  IRouteConfig,
  routeConfig,
} from "@user-dashboard/containers/Router/Router.routes";
import SidebarItem from "@user-dashboard/components/SidebarItem";
import { ISidebarItem } from "@user-dashboard/components/SidebarItem/SidebarItem.interface";
import { useStyles } from "@user-dashboard/components/Sidebar/Sidebar.style";

interface SidebarProps {}

const getSidebarConfig = (routeConfig?: IRouteConfig) => {
  return Object.values(routeConfig || {}).map((item) => {
    const { name, path, subRoutes } = item;

    return {
      text: name,
      path: path,
      subItems: subRoutes ? getSidebarConfig(subRoutes) : [],
    };
  });
};

const Sidebar: React.FC<SidebarProps> = (props: SidebarProps) => {
  const classes = useStyles();
  const location = useLocation();

  const sideBarConfig: ISidebarItem[] = useMemo(() => {
    if (location.pathname.startsWith("/payment") || location.pathname == "/") {
      return getSidebarConfig(routeConfig.payments.subRoutes);
    }

    return [];
  }, [location?.pathname]);

  return (
    <Box className={classes.box}>
      <Drawer
        variant="permanent"
        anchor="left"
        classes={{
          paper: classes.paper,
        }}
      >
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
      </Drawer>
    </Box>
  );
};

export default Sidebar;
