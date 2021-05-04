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
}

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const { onClick, label, disabled, hasMaterialUIStyle } = props;
  console.log("hasMaterialUIStyle: ", hasMaterialUIStyle);
  const classes = useStyles(props);
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
