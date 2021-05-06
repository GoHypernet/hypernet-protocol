import React from "react";

import { EStatusColor } from "../../theme";

import useStyles from "@web-ui/components/Button/Button.style";

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
      <div className={classes.linkWrapper}>
        <a className={classes.link} onClick={onClick}>
          {hasBackIcon && "←  "}
          {label}
        </a>
      </div>
    );
  }
  if (hasMaterialUIStyle) {
    return (
      <div className={classes.materialUIButtonWrapper}>
        <button
          className={classes.materialUIButton}
          onClick={onClick}
          disabled={disabled}
        >
          {label}
        </button>
      </div>
    );
  }
  return (
    <button className={classes.button} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
