import React from "react";

import { EStatusColor } from "../../theme";

import useStyles from "./Button.style";

interface ButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
  status?: EStatusColor;
  fullWidth?: boolean;
  bgColor?: string;
}

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const { onClick, label, disabled } = props;
  const classes = useStyles(props);
  return (
    <button className={classes.button} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
