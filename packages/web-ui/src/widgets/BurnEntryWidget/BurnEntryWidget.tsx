import { RegistryTokenId } from "@hypernetlabs/objects";
import { Box, Typography } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import React from "react";

import { GovernanceDialog, GovernanceButton } from "@web-ui/components";
import { useStyles } from "@web-ui/widgets/BurnEntryWidget/BurnEntryWidget.style";

interface IBurnEntryWidget {
  onCloseCallback: () => void;
  onSuccessCallback: () => void;
  registryName: string;
  tokenId: RegistryTokenId;
}

const BurnEntryWidget: React.FC<IBurnEntryWidget> = ({
  onCloseCallback,
  onSuccessCallback,
  registryName,
  tokenId,
}: IBurnEntryWidget) => {
  const classes = useStyles();
  const { coreProxy } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();

  const burnEntry = () => {
    setLoading(true);
    coreProxy
      .burnRegistryEntry(registryName, tokenId)
      .map(() => {
        setLoading(false);
        onSuccessCallback();
      })
      .mapErr(handleCoreError);
  };

  return (
    <GovernanceDialog
      title="Burn the Entry"
      isOpen={true}
      onClose={onCloseCallback}
      content={
        <>
          <Typography variant="body2">
            Are you sure you want to burn the entry?
          </Typography>

          <Box className={classes.actionContainer}>
            <GovernanceButton
              variant="outlined"
              color="primary"
              onClick={onCloseCallback}
            >
              Cancel
            </GovernanceButton>
            <GovernanceButton
              className={classes.burnButton}
              variant="contained"
              color="secondary"
              onClick={burnEntry}
            >
              Burn Entry
            </GovernanceButton>
          </Box>
        </>
      }
    />
  );
};

export default BurnEntryWidget;
