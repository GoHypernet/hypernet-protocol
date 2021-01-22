import React from "react";

interface ButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
  status?: string;
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const { onClick, label, disabled, status } = props;

  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;
