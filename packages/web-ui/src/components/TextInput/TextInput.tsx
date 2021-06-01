import React from "react";
import { Box } from "@material-ui/core";

import { useStyles } from "@web-ui/components/TextInput/TextInput.style";

interface TextInputProps {
  onChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  value?: string;
  fullWidth?: boolean;
  placeholder?: string;
}

export const TextInput: React.FC<TextInputProps> = (props: TextInputProps) => {
  const { onChange, label, disabled, value, placeholder, fullWidth } = props;

  const classes = useStyles();

  return (
    <Box className={classes.wrapper}>
      <label className={classes.label}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChange && onChange(event.target.value)
        }
        disabled={disabled}
        placeholder={placeholder}
        className={classes.textInput}
      />
    </Box>
  );
};
