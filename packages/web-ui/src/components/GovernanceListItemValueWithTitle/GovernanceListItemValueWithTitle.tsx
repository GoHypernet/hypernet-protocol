import React from "react";
import { Box, Typography } from "@material-ui/core";

import { useStyles } from "@web-integration/components/GovernanceListItemValueWithTitle/GovernanceListItemValueWithTitle.style";

export interface IGovernanceListItemValueWithTitle {
  title: string;
  value: string | number | React.ReactNode;
}

export const GovernanceListItemValueWithTitle: React.FC<IGovernanceListItemValueWithTitle> =
  (props: IGovernanceListItemValueWithTitle) => {
    const { title, value } = props;
    const classes = useStyles({});

    return (
      <Box className={classes.wrapper}>
        <Typography variant="h6" color="textPrimary" className={classes.title}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="textPrimary"
          className={classes.value}
        >
          {value}
        </Typography>
      </Box>
    );
  };
