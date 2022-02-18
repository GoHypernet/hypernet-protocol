import React, { useEffect, useRef } from "react";
import { Box, Select, Typography, MenuItem } from "@material-ui/core";
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

const CustomizedSelectForFormik = ({ children, form, field }) => {
  const classes = useStyles({});
  const { name } = field;
  const { setFieldValue } = form;

  return (
    <Select
      {...field?.props}
      required={field?.required}
      name={field?.name}
      value={field?.value}
      variant="outlined"
      className={classes.field}
      style={{ padding: 0 }}
      fullWidth
      onChange={(e) => {
        setFieldValue(name, e.target.value);
      }}
    >
      {children}
    </Select>
  );
};

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
        <Typography
          variant="body1"
          color="textPrimary"
          className={classes.title}
        >
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
        <FormikField {...props} component={CustomizedSelectForFormik}>
          {options?.length ? (
            options.map((option) => (
              <MenuItem
                value={option.value}
                onClick={() => {
                  handleChange?.(option.value);
                }}
              >
                <Box display="flex" alignItems="center" p={0}>
                  {option.label}
                </Box>
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" />
          )}
        </FormikField>
      )}
    </Box>
  );
};
