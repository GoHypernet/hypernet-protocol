import { EthereumAccountAddress, RegistryTokenId } from "@hypernetlabs/objects";
import { Box } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { Form, Formik } from "formik";
import React from "react";

import {
  GovernanceDialog,
  GovernanceButton,
  GovernanceField,
} from "@web-ui/components";
import { useStyles } from "@web-ui/widgets/TransferIdentityWidget/TransferIdentityWidget.style";

interface ITransferIdentityWidget {
  onCloseCallback: () => void;
  onSuccessCallback: () => void;
  registryName: string;
  tokenId: RegistryTokenId;
}

const TransferIdentityWidget: React.FC<ITransferIdentityWidget> = ({
  onCloseCallback,
  onSuccessCallback,
  registryName,
  tokenId,
}: ITransferIdentityWidget) => {
  const classes = useStyles();
  const { coreProxy } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();

  const transferIdentity = (values: { address: string }) => {
    setLoading(true);
    coreProxy.registries
      .transferRegistryEntry(
        registryName,
        tokenId,
        EthereumAccountAddress(values.address),
      )
      .map(() => {
        setLoading(false);
        onSuccessCallback();
      })
      .mapErr(handleCoreError);
  };

  return (
    <GovernanceDialog
      title="Transfer Nonfungible Identity"
      isOpen={true}
      onClose={onCloseCallback}
      content={
        <>
          <Formik
            enableReinitialize
            initialValues={{
              address: "",
            }}
            onSubmit={transferIdentity}
          >
            {({ handleSubmit, values }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  <GovernanceField
                    title="Address"
                    name="address"
                    type="input"
                    placeholder="Enter the address"
                    required={true}
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
                      className={classes.saveButton}
                      disabled={!values?.address}
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                    >
                      Transfer
                    </GovernanceButton>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </>
      }
    />
  );
};

export default TransferIdentityWidget;
