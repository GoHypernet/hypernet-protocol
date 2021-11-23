import React from "react";
import { List as MuiList } from "@material-ui/core";

import { useStyles } from "@web-ui/components/List/List.style";

interface ListProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const List: React.FC<ListProps> = (props: ListProps) => {
  const { children, style } = props;
  const classes = useStyles();
  return (
    <MuiList
      className={classes.list}
      {...(style && {
        style,
      })}
    >
      {children}
    </MuiList>
  );
};
