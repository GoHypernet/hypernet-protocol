import React from "react";
import {
  List,
  ListItem as MuiListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
} from "@material-ui/core";

import { useStyles } from "@web-ui/components/ListItem/ListItem.style";

interface ListItemProps {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  rightContent?: React.ReactNode;
  disableDivider?: boolean;
}

export const ListItem: React.FC<ListItemProps> = (props: ListItemProps) => {
  const { rightContent, icon, title, description, disableDivider } = props;
  const classes = useStyles();
  return (
    <Box className={classes.wrapper} >
      <MuiListItem className={classes.listItem} disableGutters>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        {
          <ListItemText
            {...(title && {
              primary: title,
            })}
            {...(description && {
              primary: description,
            })}
          />
        }
        {rightContent && (
          <Box className={classes.rightContent}>{rightContent}</Box>
        )}
      </MuiListItem>
      {!disableDivider && <Divider className={classes.divider} />}
    </Box>
  );
};
