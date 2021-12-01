import { EthereumAccountAddress } from "@hypernetlabs/objects";
import { Box } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { Form, Formik } from "formik";
import React, { useState } from "react";

import {
  GovernanceDialog,
  GovernanceButton,
  GovernanceField,
} from "@web-ui/components";
import { useStyles } from "@web-ui/widgets/RevokeRoleWidget/RevokeRoleWidget.style";

interface IValues {
  accountAddress: EthereumAccountAddress;
}
interface IRevokeRoleWidget {
  onCloseCallback: () => void;
  registrarName: string;
}

const RevokeRoleWidget: React.FC<IRevokeRoleWidget> = ({
  onCloseCallback,
  registrarName,
}: IRevokeRoleWidget) => {
  const classes = useStyles();
  const { coreProxy } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();
  const [accountAddress, setAccountAddress] = useState<EthereumAccountAddress>(
    EthereumAccountAddress(""),
  );

  const handleFormSubmit = (values: IValues) => {
    setLoading(true);
    coreProxy
      .revokeRegistrarRole(registrarName, values.accountAddress)
      .map(() => {
        setLoading(false);
        onCloseCallback();
      })
      .mapErr(handleCoreError);
  };

  return (
    <GovernanceDialog
      title="Revoke Rgistrar"
      description="Enter the address you want to Revoke the registar role from."
      isOpen={true}
      onClose={onCloseCallback}
      content={
        <Box className={classes.wrapper}>
          <Formik
            enableReinitialize
            initialValues={
              {
                accountAddress: accountAddress,
              } as IValues
            }
            onSubmit={handleFormSubmit}
          >
            {({ handleSubmit, values }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  <GovernanceField
                    name="accountAddress"
                    label="Revoke Address"
                    fullWidth
                    variant="outlined"
                    onChange={(event) =>
                      setAccountAddress(
                        EthereumAccountAddress(event.target.value),
                      )
                    }
                  />
                  <GovernanceButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={!values.accountAddress}
                  >
                    Revoke
                  </GovernanceButton>
                </Form>
              );
            }}
          </Formik>
        </Box>
      }
    />
  );
};

export default RevokeRoleWidget;
