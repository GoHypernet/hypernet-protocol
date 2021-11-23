import React from "react";
import { Box } from "@material-ui/core";

import { useStyles } from "@web-ui/components/MetamaskWarning/MetamaskWarning.style";

import {
  METAMASK_LOGO_IMAGE_URL,
  METAMASK_DOWNLOAD_URL,
} from "@web-ui/constants";
import { GovernanceButton, GovernanceTypography } from "@web-ui/components";

export const MetamaskWarning: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Box className={classes.titleWrapper}>
        <GovernanceTypography variant="h4">Oops!</GovernanceTypography>
      </Box>
      <GovernanceTypography variant="subtitle1">
        Looks like you don't have metamask installed.
      </GovernanceTypography>

      <Box className={classes.metamaskImgWrapper}>
        <img className={classes.metamaskImg} src={METAMASK_LOGO_IMAGE_URL} />
      </Box>

      <GovernanceButton
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        onClick={() => {
          window.open(METAMASK_DOWNLOAD_URL, "_blank");
        }}
      >
        Install Metamask
      </GovernanceButton>
    </div>
  );
};
