import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";
import { Form, Formik } from "formik";

import {
  GovernanceDialog,
  GovernanceButton,
  GovernanceField,
} from "@web-ui/components";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { EthereumAddress } from "@hypernetlabs/objects";
import { useStyles } from "@web-ui/widgets/RenounceRoleWidget/RenounceRoleWidget.style";

interface IValues {
  accountAddress: EthereumAddress;
}
interface IRenounceRoleWidget {
  onCloseCallback: () => void;
  registrarName: string;
}

const RenounceRoleWidget: React.FC<IRenounceRoleWidget> = ({
  onCloseCallback,
  registrarName,
}: IRenounceRoleWidget) => {
  const alert = useAlert();
  const classes = useStyles();
  const { coreProxy, UIData } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>(
    EthereumAddress(""),
  );

  const handleFormSubmit = (values: IValues) => {
    setLoading(true);
    coreProxy
      .renounceRegistrarRole(registrarName, values.accountAddress)
      .map(() => {
        setLoading(false);
        onCloseCallback();
      })
      .mapErr(handleError);
  };

  const handleError = (err?: Error) => {
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  return (
    <GovernanceDialog
      title="Renounce Rgistrar"
      description="Enter the address you want to renounce the registar role for."
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
                    label="Renounce Address"
                    fullWidth
                    variant="outlined"
                    onChange={(event) =>
                      setAccountAddress(EthereumAddress(event.target.value))
                    }
                  />
                  <GovernanceButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={!values.accountAddress}
                  >
                    Renounce
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

export default RenounceRoleWidget;
