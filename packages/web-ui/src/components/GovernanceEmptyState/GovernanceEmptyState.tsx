import React from "react";
import { Box, Typography } from "@material-ui/core";

import { useStyles } from "@web-ui/components/GovernanceEmptyState/GovernanceEmptyState.style";

export interface IGovernanceEmptyState {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  img?: React.ReactNode;
}

export const GovernanceEmptyState: React.FC<IGovernanceEmptyState> = (
  props: IGovernanceEmptyState,
) => {
  const { title, description, img } = props;
  const classes = useStyles({});

  return (
    <Box className={classes.wrapper}>
      {img || (
        <img
          width="150"
          src="https://res.cloudinary.com/barhantas/image/upload/v1633475136/carry_pwthhs.svg"
        />
      )}

      <Typography variant="body1" color="textPrimary" className={classes.title}>
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {description}
      </Typography>
    </Box>
  );
};
