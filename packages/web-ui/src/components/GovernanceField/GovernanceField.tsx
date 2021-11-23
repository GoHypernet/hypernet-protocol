import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@material-ui/core";
import { Field as FormikField, FieldAttributes } from "formik";
import { useStyles } from "@web-ui/components/GovernanceField/GovernanceField.style";
import { ISelectOption } from "@web-ui/components/GovernanceLargeField/GovernanceLargeField";

export interface GovernanceFieldProps extends FieldAttributes<any> {
  title?: string;
  type?: "input" | "textarea" | "select";
  options?: ISelectOption[];
  rightContent?: React.ReactNode;
  focus?: boolean;
  handleChange?: (value: any) => void;
}

export const GovernanceField: React.FC<GovernanceFieldProps> = (
  props: GovernanceFieldProps,
) => {
  const {
    title,
    type = "input",
    required,
    options,
    focus,
    rightContent,
    handleChange,
    className,
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
            {...props}
            className={`${classes.field} ${className}`}
            component={type}
          />

          {rightContent && (
            <Box className={classes.rightContent}>{rightContent}</Box>
          )}
        </Box>
      ) : (
        <FormikField
          {...props}
          className={`${classes.field} ${className}`}
          as="select"
          component={type}
          {...(handleChange && {
            onChange: (e: React.ChangeEvent<any>) => {
              handleChange(e?.target?.value);
            },
          })}
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
