import React from "react";

interface SelectInputProps {
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  disabled?: boolean;
  value?: string;
  fullWidth?: boolean;
  options: any[];
  optionLabelKey: string;
  optionValueKey: string;
}

export const SelectInput: React.FC<SelectInputProps> = (
  props: SelectInputProps,
) => {
  const {
    onChange,
    label,
    disabled,
    value,
    fullWidth,
    options,
    optionValueKey,
    optionLabelKey,
  } = props;

  return (
    <label>
      {label}
      <select value={value} onChange={onChange} disabled={disabled}>
        <option value="">Choose...</option>
        {options?.map((option: any, index: number) => (
          <option key={index} value={option[optionValueKey]}>
            {option[optionLabelKey]}
          </option>
        ))}
      </select>
    </label>
  );
};
