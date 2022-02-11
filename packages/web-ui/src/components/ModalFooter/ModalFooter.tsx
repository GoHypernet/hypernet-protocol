import React from "react";
import { Box } from "@material-ui/core";
import { GovernanceButton } from "@web-ui/components";
import { useStyles } from "@web-ui/components/ModalFooter/ModalFooter.style";
import { LAUNCHPAD_PROD_URL } from "@web-ui/constants";

interface ModalFooterProps {
  url?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  url = LAUNCHPAD_PROD_URL,
}: ModalFooterProps) => {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <GovernanceButton
        className={classes.linkButton}
        variant="text"
        color="primary"
        fullWidth
        onClick={() => {
          window.open(url);
        }}
      >
        View your Hypernet Account.
      </GovernanceButton>
    </Box>
  );
};
