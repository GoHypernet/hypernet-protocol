import { Box } from "@material-ui/core";
import React from "react";

import { useStyles } from "./ModalFooter.style";

export const ModalFooter: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Box className={classes.account}>
        <a
          className={classes.accountLink}
          href="https://hypernet-protocol-dashboard-dev.hypernetlabs.io/"
          target="_blank"
        >
          View your Hypernet Protocol account.
        </a>
      </Box>
    </Box>
  );
};
