import { Box } from "@material-ui/core";
import React from "react";

import { useStyles } from "./ModalHeader.style";

import { HYPERNET_PROTOCOL_LOGO_DARK_URL } from "@web-ui/constants";

export const ModalHeader: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Box className={classes.imageContainer}>
        <img height={32} src={HYPERNET_PROTOCOL_LOGO_DARK_URL} />
      </Box>
    </Box>
  );
};
