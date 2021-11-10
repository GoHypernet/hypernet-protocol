import React, { useState } from "react";
import { Box, Typography } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceDialog,
  GovernanceButton,
  GovernanceField,
} from "@web-ui/components";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { EthereumAddress } from "@hypernetlabs/objects";
import { useStyles } from "@web-ui/widgets/BurnEntryWidget/BurnEntryWidget.style";

interface IBurnEntryWidget {
  onCloseCallback: () => void;
  onSuccessCallback: () => void;
  registryName: string;
  tokenId: number;
}

const BurnEntryWidget: React.FC<IBurnEntryWidget> = ({
  onCloseCallback,
  onSuccessCallback,
  registryName,
  tokenId,
}: IBurnEntryWidget) => {
  const alert = useAlert();
  const classes = useStyles();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();

  const burnEntry = () => {
    setLoading(true);
    coreProxy
      .burnRegistryEntry(registryName, tokenId)
      .map(() => {
        setLoading(false);
        onSuccessCallback();
      })
      .mapErr(handleError);
  };

  const handleError = (err) => {
    setLoading(false);
    alert.error(
      err?.src?.data?.message || err?.message || "Something went wrong!",
    );
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
