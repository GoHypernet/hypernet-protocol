import React from "react";

interface TextInputProps {
  onChange?: (value: string) => void;
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
      <input
        type="text"
        value={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange && onChange(event.target.value)}
        disabled={disabled}
        placeholder={placeholder}
      />
    </label>
  );
};

export default TextInput;
