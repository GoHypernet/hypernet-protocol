import { Box } from "@material-ui/core";
import React from "react";

import { GovernanceButton, GovernanceTypography } from "@web-ui/components";
import { useStyles } from "@web-ui/components/SucessContent/SucessContent.style";
import { AUTHENTICATION_SUCCESS_IMAGE_URL } from "@web-ui/constants";

interface ISucessContentProps {
  label?: string;
  info?: string;
  onOkay?: () => void;
}

export const SucessContent: React.FC<ISucessContentProps> = (
  props: ISucessContentProps,
) => {
  const { label = "SUCCESS!", info, onOkay } = props;
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <Box className={classes.titleWrapper}>
        <GovernanceTypography variant="h4">{label}</GovernanceTypography>
      </Box>

      <Box className={classes.subtitleWrapper}>
        <GovernanceTypography variant="subtitle1">
          You have successfully connected your wallet.
        </GovernanceTypography>
      </Box>

      {info && (
        <Box className={classes.subtitleWrapper}>
          <GovernanceTypography
            variant="subtitle1"
            dangerouslySetInnerHTML={{ __html: info }}
          />
        </Box>
      )}
      {onOkay && (
        <Box className={classes.doneButtonWrapper}>
          <GovernanceButton
            fullWidth
            color="primary"
            variant="contained"
            onClick={onOkay}
          >
            Done
          </GovernanceButton>
        </Box>
      )}
    </Box>
  );
};
