import { Box } from "@material-ui/core";
import React from "react";

import { useStyles } from "@web-ui/components/Button/Button.style";
import { EStatusColor } from "@web-ui/theme";

interface ButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
  status?: EStatusColor;
  fullWidth?: boolean;
  bgColor?: string;
  hasMaterialUIStyle?: boolean;
  linkStyle?: boolean;
  hasBackIcon?: boolean;
}

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const {
    onClick,
    label,
    disabled,
    hasMaterialUIStyle,
    linkStyle,
    hasBackIcon,
  } = props;
  const classes = useStyles(props);

  if (linkStyle) {
    return (
      <Box className={classes.linkWrapper}>
        <a className={classes.link} onClick={onClick}>
          {hasBackIcon && "←  "}
          {label}
        </a>
      </Box>
    );
  }
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
  return (
    <button className={classes.button} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
