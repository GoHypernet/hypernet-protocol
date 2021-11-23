import React, { useEffect, useRef } from "react";
import { Box, IconButton, Typography } from "@material-ui/core";
import { Field as FormikField, FieldAttributes } from "formik";
import { useStyles } from "@web-ui/components/GovernanceLargeField/GovernanceLargeField.style";

export interface GovernanceLargeFieldProps extends FieldAttributes<any> {
  title?: string;
  type?: "input" | "textarea" | "select";
  options?: ISelectOption[];
  rightContent?: React.ReactNode;
  focus?: boolean;
}

export interface ISelectOption {
  label: string;
  value: any;
}

export const GovernanceLargeField: React.FC<GovernanceLargeFieldProps> = (
  props: GovernanceLargeFieldProps,
) => {
  const {
    title,
    type = "input",
    required,
    options,
    focus,
    rightContent,
  } = props;
  const classes = useStyles({});
  const titleText = `${title}${required ? " *" : ""}`;
  const isSelect = type === "select";

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focus) {
      inputRef.current?.focus();
    }
  }, []);

  return (
    <Box className={classes.wrapper}>
      {title && (
        <Typography variant="h6" color="textPrimary" className={classes.title}>
          {titleText}
        </Typography>
      )}

      {!isSelect ? (
        <Box className={classes.fieldWrapper}>
          <FormikField
            innerRef={inputRef}
            className={classes.field}
            {...props}
            component={type}
          />

          {rightContent && (
            <Box className={classes.rightContent}>{rightContent}</Box>
          )}
        </Box>
      ) : (
        <FormikField
          className={classes.field}
          {...props}
          as="select"
          component={type}
        >
          {options?.length &&
            options.map((option) => (
              <option value={option.value}>{option.label}</option>
            ))}
        </FormikField>
      )}
    </Box>
  );
};
