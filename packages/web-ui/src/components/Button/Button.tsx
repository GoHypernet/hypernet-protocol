import React from "react";
import { colors, EStatusColor, getColorFromStatus } from "../../theme";

interface ButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
  status?: EStatusColor;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const { onClick, label, disabled, status = EStatusColor.SUCCESS, fullWidth } = props;

  return (
    <button
      style={{
        padding: "9px 26px",
        color: colors.WHITE,
        textAlign: "center",
        fontSize: 15,
        background: `${getColorFromStatus(status)} 0% 0% no-repeat padding-box`,
        borderRadius: 4,
        border: "none",
        cursor: "pointer",
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
