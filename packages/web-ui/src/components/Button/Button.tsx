import React from "react";
import { EStatusColor, getColorFromStatus } from "../../theme";
import styles from "./Button.style";

interface ButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
  status?: EStatusColor;
  fullWidth?: boolean;
  bgColor?: string;
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const { onClick, label, disabled, status = EStatusColor.PRIMARY, fullWidth, bgColor } = props;

  return (
    <button
      style={{
        ...styles.button,
        background: bgColor || `${getColorFromStatus(status)} 0% 0% no-repeat padding-box`,
        width: fullWidth ? "100%" : "auto",
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
