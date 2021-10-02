import {
  Button as MuiButton,
  PropTypes,
  CircularProgress,
  Box,
  ButtonProps,
} from "@material-ui/core";
import React from "react";

import { useStyles } from "@web-ui/components/GovernanceButton/GovernanceButton.style";

export interface IGovernanceButton extends ButtonProps {
  color?: PropTypes.Color;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "text" | "outlined" | "contained";
  children?: string | React.ReactNode;
  startIcon?: React.ReactNode;
  autoFocus?: boolean;
  size?: "small" | "medium" | "large";
  isDangerButton?: boolean;
  fullWidth?: boolean;
}

export const GovernanceButton: React.FC<IGovernanceButton> = ({
  color = "primary",
  onClick,
  disabled,
  loading,
  variant,
  children,
  startIcon,
  autoFocus,
  size,
  isDangerButton,
  fullWidth,
  ...rest
}: IGovernanceButton) => {
  const classes = useStyles();

  return (
    <MuiButton
      {...rest}
      disableElevation
      onClick={onClick}
      variant={variant}
      color={color}
      disabled={disabled}
      startIcon={startIcon}
      autoFocus={autoFocus}
      size={size}
      fullWidth={fullWidth}
    >
      {children}
      {loading && (
        <Box className={classes.loadingWrapper}>
          <CircularProgress color="inherit" size={13} />
        </Box>
      )}
    </MuiButton>
  );
};
