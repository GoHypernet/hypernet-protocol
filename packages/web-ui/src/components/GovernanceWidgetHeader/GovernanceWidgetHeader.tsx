import { Box, Typography } from "@material-ui/core";
import React from "react";

import { useStyles } from "@web-ui/components/GovernanceWidgetHeader/GovernanceWidgetHeader.style";
import { IGovernanceButton, GovernanceButton } from "@web-ui/components";
import { ArrowBack as ArrowBackIcon } from "@material-ui/icons";

export interface IHeaderAction extends IGovernanceButton {
  label: string;
}

interface INavigationLink {
  label: string;
  onClick: () => void;
}

interface IGovernanceWidgetHeader {
  navigationLink?: INavigationLink;
  label?: string;
  description?: string | React.ReactNode;
  rightContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  headerActions?: IHeaderAction[];
}

export const GovernanceWidgetHeader: React.FC<IGovernanceWidgetHeader> = ({
  navigationLink,
  label,
  description,
  rightContent,
  bottomContent,
  headerActions = [],
}: IGovernanceWidgetHeader) => {
  const classes = useStyles();

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.topSection}>
        <Box className={classes.leftSection}>
          {navigationLink && (
            <Box
              className={classes.navigationWrapper}
              onClick={navigationLink.onClick}
            >
              <ArrowBackIcon className={classes.navigationIcon} />
              <Typography
                variant="subtitle2"
                color="textPrimary"
                className={classes.navigationLabel}
              >
                {navigationLink.label}
              </Typography>
            </Box>
          )}
          <Typography variant="h1" className={classes.label}>
            {label}
          </Typography>
          <Typography className={classes.description}>{description}</Typography>
        </Box>
        {(headerActions?.length || !!rightContent) && (
          <Box className={classes.rightSection}>
            <Box display="flex">
              {headerActions.map((headerAction) => (
                <Box className={classes.buttonWrapper}>
                  <GovernanceButton
                    color="primary"
                    size="medium"
                    {...headerAction}
                  >
                    {headerAction.label}
                  </GovernanceButton>
                </Box>
              ))}
            </Box>
            {!!rightContent && (
              <Box className={classes.rightSection}>{rightContent}</Box>
            )}
          </Box>
        )}
      </Box>
      {!!bottomContent && (
        <Box className={classes.bottomSection}>{bottomContent}</Box>
      )}
    </Box>
  );
};
