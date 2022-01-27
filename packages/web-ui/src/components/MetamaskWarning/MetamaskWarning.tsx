import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";

import { useStyles } from "@web-ui/components/MetamaskWarning/MetamaskWarning.style";

import {
  METAMASK_LOGO_IMAGE_URL,
  METAMASK_DOWNLOAD_URL,
} from "@web-ui/constants";
import { GovernanceButton, GovernanceTypography } from "@web-ui/components";
import { useLayoutContext } from "@web-ui/contexts";

export const MetamaskWarning: React.FC = () => {
  const classes = useStyles();
  const { setModalHeader } = useLayoutContext();
  const [installClicked, setInstallClicked] = useState(false);

  useEffect(() => {
    setModalHeader("Wallet Connection");
  }, []);

  if (installClicked) {
    return (
      <div className={classes.wrapper}>
        <GovernanceTypography variant="subtitle1">
          If you are done installing MetaMask, continue.
        </GovernanceTypography>

        <Box className={classes.metamaskImgWrapper}>
          <img className={classes.metamaskImg} src={METAMASK_LOGO_IMAGE_URL} />
        </Box>

        <GovernanceButton
          className={classes.continueButton}
          color="primary"
          variant="contained"
          size="medium"
          fullWidth
          onClick={() => {
            // re-initialize
          }}
        >
          Continue
        </GovernanceButton>

        <GovernanceButton
          color="primary"
          variant="outlined"
          size="medium"
          fullWidth
          onClick={() => {
            window.open(METAMASK_DOWNLOAD_URL, "_blank");
          }}
        >
          Install Metamask
        </GovernanceButton>
      </div>
    );
  }

  return (
    <div className={classes.wrapper}>
      <GovernanceTypography variant="subtitle1">
        Looks like you don't have metamask installed.
      </GovernanceTypography>

      <Box className={classes.metamaskImgWrapper}>
        <img className={classes.metamaskImg} src={METAMASK_LOGO_IMAGE_URL} />
      </Box>

      <GovernanceButton
        color="primary"
        variant="contained"
        size="medium"
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
