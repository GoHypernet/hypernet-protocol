import { Box } from "@material-ui/core";
import React from "react";

import { useStyles } from "@web-ui/components/Button/Button.style";
import { EButtonStatus } from "@web-ui/theme";

interface ButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
  status?: EButtonStatus;
  fullWidth?: boolean;
  bgColor?: string;
  hasMaterialUIStyle?: boolean;
  hasBackIcon?: boolean;
}

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const {
    onClick,
    label,
    disabled,
    hasMaterialUIStyle,
    hasBackIcon,
    status = EButtonStatus.primary,
  } = props;
  const classes = useStyles(props);

  if (hasMaterialUIStyle) {
    return (
      <Box className={classes.materialUIButtonWrapper}>
        <button
          className={classes.materialUIButton}
          onClick={onClick}
          disabled={disabled}
        >
          {label}
        </button>
      </Box>
    );
  }

  if (status === EButtonStatus.link) {
    return (
      <Box className={classes.linkWrapper}>
        <a className={classes.link} onClick={onClick}>
          {hasBackIcon && "←  "}
          {label}
        </a>
      </Box>
    );
  }

  if (status === EButtonStatus.secondary) {
    return (
      <button
        className={`${classes.button} ${classes.secondaryButton}`}
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </button>
    );
  }

  return (
    <button className={classes.button} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
