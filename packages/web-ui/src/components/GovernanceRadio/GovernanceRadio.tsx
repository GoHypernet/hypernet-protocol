import React from "react";
import { Radio, RadioProps } from "@material-ui/core";

import { useStyles } from "@web-ui/components/GovernanceRadio/GovernanceRadio.style";

interface GovernanceRadioProps extends RadioProps {}

export const GovernanceRadio: React.FC<GovernanceRadioProps> = (
  props: GovernanceRadioProps,
) => {
  const classes = useStyles();
  return (
    <Radio
      disableRipple
      className={classes.root}
      icon={<span className={classes.icon} />}
      checkedIcon={
        <span className={`${classes.icon} ${classes.checkedIcon}`} />
      }
      {...props}
    />
  );
};
