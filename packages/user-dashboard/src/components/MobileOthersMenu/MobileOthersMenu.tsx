import { Box, IconButton, Menu, MenuItem } from "@material-ui/core";
import { pathToRegexp } from "path-to-regexp";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import { useStyles } from "@user-dashboard/components/MobileOthersMenu/MobileOthersMenu.style";
import { routes } from "@user-dashboard/containers/Router/Router.routes";

const Header: React.FC = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (
    e: React.MouseEvent<HTMLLIElement> | React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const isPathMatchRequestedUrl: (path: string) => boolean = (path: string) =>
    !!pathToRegexp(path).exec(pathname);

  return (
    <Box>
      <IconButton
        className={classes.iconButton}
        aria-label="menu-icon"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        className={classes.menu}
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={(
          e:
            | React.MouseEvent<HTMLLIElement>
            | React.MouseEvent<HTMLAnchorElement>,
        ) => {
          handleClose(e);
        }}
      >
        {routes.map((route, index) =>
          route.isHeaderItem ? (
            <MenuItem
              key={index}
              className={`${classes.menuItem} ${
                isPathMatchRequestedUrl(route.path)
                  ? classes.activeMenuItem
                  : classes.inactiveMenuItem
              }`}
              onClick={() => {
                history.push(route.path);
              }}
            >
              {route.name}
            </MenuItem>
          ) : null,
        )}
      </Menu>
    </Box>
  );
};

export default Header;
