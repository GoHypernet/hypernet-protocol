import React, { memo, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ListItemText, Box } from "@material-ui/core";
import { pathToRegexp } from "path-to-regexp";

import {
  StyledListItem,
  useStyles,
} from "@user-dashboard/components/SidebarItem/SidebarItem.style";
import { ISidebarItem } from "@user-dashboard/components/SidebarItem/SidebarItem.interface";
import { ROUTES } from "@user-dashboard/containers/Router/Router.routes";

interface ISideBarItemProps extends ISidebarItem {}

const SidebarItem: React.FC<ISideBarItemProps> = (props: ISideBarItemProps) => {
  const { text, path, subItems = [] } = props;
  const history = useHistory();
  const classes = useStyles();
  const { pathname } = useLocation();

  const isSelected = useMemo(() => {
    if (pathname === ROUTES.PAYMENTS) {
      return path === ROUTES.PAYMENT_HISTORY;
    }

    return !!pathToRegexp(path).exec(pathname);
  }, [pathname, path]);

  return (
    <StyledListItem
      button
      onClick={(e) => {
        !subItems.length && history.push(path);
      }}
      selected={isSelected}
      {...(!!subItems.length && { className: classes.parentListItem })}
    >
      <ListItemText
        primaryTypographyProps={{ variant: "subtitle2" }}
        primary={text}
        secondary={
          !!subItems.length && (
            <Box pt={1}>
              {subItems.map(
                ({ text, path, subItems: innerSubItems }, index) => (
                  <SidebarItem
                    key={index}
                    text={text}
                    path={path}
                    subItems={innerSubItems}
                  />
                ),
              )}
            </Box>
          )
        }
        className={classes.listItemText}
      />
    </StyledListItem>
  );
};

export default memo(SidebarItem);
