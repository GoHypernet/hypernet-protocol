import React from "react";

interface TextInputProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  value?: string;
  fullWidth?: boolean;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = (props: TextInputProps) => {
  const { onChange, label, disabled, value, placeholder, fullWidth } = props;

  return (
    <label>
      {label}
      <input type="text" value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} />
    </label>
  );
};

export default TextInput;
