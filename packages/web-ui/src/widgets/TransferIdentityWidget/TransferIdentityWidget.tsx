import React, { useState } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceDialog,
  GovernanceButton,
  GovernanceField,
} from "@web-ui/components";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { EthereumAddress } from "@hypernetlabs/objects";
import { useStyles } from "@web-ui/widgets/TransferIdentityWidget/TransferIdentityWidget.style";

interface ITransferIdentityWidget {
  onCloseCallback: () => void;
}

const TransferIdentityWidget: React.FC<ITransferIdentityWidget> = ({
  onCloseCallback,
}: ITransferIdentityWidget) => {
  const alert = useAlert();
  const classes = useStyles();
  const { coreProxy, UIData } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>(
    EthereumAddress(""),
  );

  const transferIdentity = () => {
    setLoading(true);
    coreProxy
      .delegateVote(accountAddress, null)
      .map(() => {
        UIData.onVotesDelegated.next();
        setLoading(false);
        onCloseCallback();
      })
      .mapErr(handleError);
  };

  const handleError = (err?: Error) => {
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  const handleAddressFieldChange = (value: string) => {
    setAccountAddress(EthereumAddress(value));
  };

  return (
    <GovernanceDialog
      title="Transfer Nonfungible Identity"
      isOpen={true}
      onClose={onCloseCallback}
      content={
        <>
          <GovernanceField
            title="Gateway Url"
            type="input"
            placeholder="Type a gateway url"
            required={false}
            rows={1}
            handleChange={handleAddressFieldChange}
          />
          <Box className={classes.actionContainer}>
            <GovernanceButton
              variant="outlined"
              color="primary"
              onClick={onCloseCallback}
            >
              Cancel
            </GovernanceButton>
            <GovernanceButton
              variant="contained"
              color="primary"
              onClick={transferIdentity}
            >
              Save
            </GovernanceButton>
          </Box>
        </>
      }
    />
  );
};

export default TransferIdentityWidget;
