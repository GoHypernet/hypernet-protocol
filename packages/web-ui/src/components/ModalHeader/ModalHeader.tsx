import { Box } from "@material-ui/core";
import React from "react";

import { useStyles } from "./ModalHeader.style";

import { HYPER_TOKEN_LOGO_URL } from "@web-ui/constants";

export const ModalHeader: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Box className={classes.imageContainer}>
          <img width="225" src={HYPER_TOKEN_LOGO_URL} />
        </Box>
      </Box>
    </Box>
  );
};
