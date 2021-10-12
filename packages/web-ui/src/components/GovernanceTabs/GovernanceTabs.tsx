import React from "react";
import {
  Box,
  Tab,
  Tabs,
  TabProps,
  TabsTypeMap,
  withStyles,
} from "@material-ui/core";

interface IGovernanceTabPanel {
  children: React.ReactNode;
  value: number;
  index: number;
}

export const GovernanceTabs = withStyles((theme) => ({
  root: {
    marginBottom: 24,
  },
}))((props: TabsTypeMap["props"]) => <Tabs {...props} />);

export const GovernanceTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    minHeight: 64,
  },
}))((props: TabProps) => <Tab disableRipple {...props} />);

export const GovernanceTabPanel: React.FC<IGovernanceTabPanel> = ({
  children,
  value,
  index,
  ...other
}: IGovernanceTabPanel) => {
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
