import { EthereumAccountAddress, RegistryTokenId } from "@hypernetlabs/objects";
import { Box } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useAlert } from "react-alert";

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
  const alert = useAlert();
  const classes = useStyles();
  const { coreProxy, UIData } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [accountAddress, setAccountAddress] = useState<EthereumAccountAddress>(
    EthereumAccountAddress(""),
  );

  const transferIdentity = (values: { address: string }) => {
    setLoading(true);
    coreProxy
      .transferRegistryEntry(
        registryName,
        tokenId,
        EthereumAccountAddress(values.address),
      )
      .map(() => {
        setLoading(false);
        onSuccessCallback();
      })
      .mapErr(handleError);
  };

  const handleError = (err) => {
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  const handleAddressFieldChange = (value: string) => {
    setAccountAddress(EthereumAccountAddress(value));
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
