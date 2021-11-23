import React from "react";
import { Checkbox, CheckboxProps } from "@material-ui/core";

import { useStyles } from "@web-ui/components/GovernanceCheckbox/GovernanceCheckbox.style";

interface GovernanceCheckboxProps extends CheckboxProps {}

export const GovernanceCheckbox: React.FC<GovernanceCheckboxProps> = (
  props: GovernanceCheckboxProps,
) => {
  const classes = useStyles();
  return (
    <Checkbox
      {...props}
      disableRipple
      className={`${classes.root} ${props?.className}`}
      icon={<span className={classes.icon} />}
      checkedIcon={
        <span className={`${classes.icon} ${classes.checkedIcon}`} />
      }
    />
  );
};
