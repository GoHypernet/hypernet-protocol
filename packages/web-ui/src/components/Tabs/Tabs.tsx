import { Box, Tab, Tabs, TabTypeMap, withStyles } from "@material-ui/core";
import React from "react";

interface ITabPanel {
  children: React.ReactNode;
  value: number;
  index: number;
}

export const TabPanel: React.FC<ITabPanel> = ({
  children,
  value,
  index,
  ...other
}: ITabPanel) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export const AntTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
    boxShadow: "none",
  },
  indicator: {
    backgroundColor: "#1890ff",
  },
})(Tabs);

export const AntTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      color: "#40a9ff",
      opacity: 1,
    },
    "&$selected": {
      color: "#1890ff",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: "#40a9ff",
    },
  },
  selected: {},
}))((props: TabTypeMap["props"]) => <Tab disableRipple {...props} />);
