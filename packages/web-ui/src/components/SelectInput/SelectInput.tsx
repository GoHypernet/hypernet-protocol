import React from "react";
import { Box } from "@material-ui/core";

import { useStyles } from "@web-ui/components/SelectInput/SelectInput.style";

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

  const classes = useStyles();

  return (
    <Box className={classes.wrapper}>
      <label className={classes.selectLabel}>{label}</label>
      <Box className={classes.select}>
        <select
          className={classes.selectText}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required
        >
          <option value="">Choose...</option>
          {options?.map((option: any, index: number) => (
            <option key={index} value={option[optionValueKey]}>
              {option[optionLabelKey]}
            </option>
          ))}
        </select>
      </Box>
    </Box>
  );
};
