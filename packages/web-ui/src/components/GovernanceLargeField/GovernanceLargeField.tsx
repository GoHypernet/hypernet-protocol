import React from "react";
import { Box, Typography } from "@material-ui/core";
import { Field as FormikField, FieldAttributes } from "formik";
import { useStyles } from "@web-ui/components/GovernanceLargeField/GovernanceLargeField.style";

export interface GovernanceLargeFieldProps extends FieldAttributes<any> {
  title?: string;
  type?: "input" | "textarea" | "select";
  options?: ISelectOption[];
}

export interface ISelectOption {
  label: string;
  value: any;
}

export const GovernanceLargeField: React.FC<GovernanceLargeFieldProps> = (
  props: GovernanceLargeFieldProps,
) => {
  const { title, type = "input", required, options } = props;
  const classes = useStyles({});
  const titleText = `${title}${required ? " *" : ""}`;
  const isSelect = type === "select";

  return (
    <Box className={classes.wrapper}>
      {title && (
        <Typography variant="h6" color="textPrimary" className={classes.title}>
          {titleText}
        </Typography>
      )}
      {!isSelect ? (
        <FormikField className={classes.field} {...props} component={type} />
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
