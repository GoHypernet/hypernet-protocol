import { Box } from "@material-ui/core";
import React from "react";

import { GovernanceTypography } from "@web-integration/components";

import { useLayoutContext } from "@web-ui/contexts";
import { useStyles } from "./ModalHeader.style";

import { HYPERNET_PROTOCOL_LOGO_DARK_URL } from "@web-ui/constants";

export const ModalHeader: React.FC = () => {
  const { modalHeader } = useLayoutContext();

  const classes = useStyles();

  return modalHeader ? (
    <GovernanceTypography variant="h4">{modalHeader}</GovernanceTypography>
  ) : (
    <Box className={classes.container}>
      <Box className={classes.imageContainer}>
        <img height={32} src={HYPERNET_PROTOCOL_LOGO_DARK_URL} />
      </Box>
    </Box>
  );
};
