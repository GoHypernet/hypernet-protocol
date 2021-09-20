import { Box, Typography } from "@material-ui/core";
import React from "react";

import { useStyles } from "@web-ui/components/GovernanceWidgetHeader/GovernanceWidgetHeader.style";
import { IGovernanceButton, GovernanceButton } from "@web-ui/components";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

interface IHeaderAction extends IGovernanceButton {
  label: string;
}

interface INavigationLink {
  label: string;
  onClick: () => void;
}

interface IGovernanceWidgetHeader {
  navigationLink?: INavigationLink;
  label?: string;
  headerActions?: IHeaderAction[];
}

export const GovernanceWidgetHeader: React.FC<IGovernanceWidgetHeader> = ({
  navigationLink,
  label,
  headerActions,
}: IGovernanceWidgetHeader) => {
  const classes = useStyles();

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.leftSection}>
        {navigationLink && (
          <Box
            className={classes.navigationWrapper}
            onClick={navigationLink.onClick}
          >
            <KeyboardBackspaceIcon className={classes.navigationIcon} />
            <Typography variant="body1" className={classes.navigationLabel}>
              {navigationLink.label}
            </Typography>
          </Box>
        )}
        <Typography variant="h1" className={classes.label}>
          {label}
        </Typography>
      </Box>
      {headerActions && (
        <Box className={classes.rightSection}>
          {headerActions.map((headerAction) => (
            <Box className={classes.buttonWrapper}>
              <GovernanceButton {...headerAction} size="medium">
                {headerAction.label}
              </GovernanceButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
