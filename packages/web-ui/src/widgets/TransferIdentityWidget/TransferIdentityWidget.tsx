import React, { useState } from "react";
import { Box } from "@material-ui/core";
import { Form, Formik } from "formik";
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
                      Save
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
