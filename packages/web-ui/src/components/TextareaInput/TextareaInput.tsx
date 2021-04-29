import React from "react";

interface TextareaInputProps {
  onChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  value?: string;
  fullWidth?: boolean;
  placeholder?: string;
  rows?: number;
}

const TextareaInput: React.FC<TextareaInputProps> = (
  props: TextareaInputProps,
) => {
  const { onChange, label, disabled, value, placeholder, rows } = props;

  return (
    <label>
      {label}
      <textarea
        rows={rows || 3}
        value={value}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange && onChange(event.target.value)
        }
        disabled={disabled}
        placeholder={placeholder}
      />
    </label>
  );
};

export default TextareaInput;
