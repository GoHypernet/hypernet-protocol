import React from "react";
import { Box, Typography } from "@material-ui/core";

import { useStyles } from "@web-integration/components/GovernanceEmptyState/GovernanceEmptyState.style";

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
          src="https://res.cloudinary.com/dqueufbs7/image/upload/v1622582034/images/Screen_Shot_2021-06-02_at_00.12.25.png"
        />
      )}

      <Typography variant="body1" className={classes.title}>
        {title}
      </Typography>
      <Typography variant="body2">{description}</Typography>
    </Box>
  );
};
