import React from "react";
import {
  List,
  ListItem as MuiListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@material-ui/core";

import { useStyles } from "@web-ui/components/ListItem/ListItem.style";

interface ListItemProps {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export const ListItem: React.FC<ListItemProps> = (
  props: ListItemProps,
) => {
  const { rightContent, icon, title, description } = props;
  const classes = useStyles();
  return (
    <List className={classes.list}>
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
    </List>
  );
};
