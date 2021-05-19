import { Box } from "@material-ui/core";
import React from "react";

import { useStyles } from "./ModalHeader.style";

export const ModalHeader: React.FC = () => {
  const classes = useStyles();
  const connectorLogoUrl =
    "https://res.cloudinary.com/dqueufbs7/image/upload/v1614369421/images/Screen_Shot_2021-02-26_at_22.56.34.png";

  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Box className={classes.imageContainer}>
          <img width="40" src={connectorLogoUrl} />
          <Box className={classes.connectorName}>Hypernet</Box>
        </Box>
      </Box>
    </Box>
  );
};
