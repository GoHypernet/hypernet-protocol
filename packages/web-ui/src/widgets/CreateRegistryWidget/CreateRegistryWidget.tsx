import React from "react";
import { Box } from "@material-ui/core";
import { Form, Formik } from "formik";

import { useAlert } from "react-alert";

import {
  GovernanceDialog,
  GovernanceButton,
  GovernanceField,
  GovernanceDialogSelectLargeField,
} from "@web-ui/components";
import { EthereumAddress } from "@hypernetlabs/objects";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { useStyles } from "@web-ui/widgets/CreateRegistryWidget/CreateRegistryWidget.style";

interface ICreateRegistryWidget {
  onCloseCallback: () => void;
  currentAccountAddress: EthereumAddress;
}

interface ICreateRegistryFormValues {
  name: string;
  symbol: string;
  registrar: string;
  enumerable: boolean;
}

const CreateRegistryWidget: React.FC<ICreateRegistryWidget> = ({
  onCloseCallback,
  currentAccountAddress,
}: ICreateRegistryWidget) => {
  const alert = useAlert();
  const classes = useStyles();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();

  const handleError = (err) => {
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
    onCloseCallback();
  };

  const handleCreateRegistry = ({
    name,
    symbol,
    registrar,
    enumerable,
  }: ICreateRegistryFormValues) => {
    //setLoading(true);
    console.log("name", name, symbol, registrar, enumerable);

    coreProxy
      .createRegistryByToken(
        name,
        symbol,
        EthereumAddress(registrar),
        enumerable,
      )
      .map(() => {
        setLoading(false);
        onCloseCallback();
      })
      .mapErr(handleError);
  };

  return (
    <GovernanceDialog
      title="Create a New Registry"
      isOpen={true}
      onClose={onCloseCallback}
      content={
        <Box className={classes.wrapper}>
          <Formik
            initialValues={{
              name: "",
              symbol: "",
              registrar: currentAccountAddress,
              enumerable: true,
            }}
            onSubmit={handleCreateRegistry}
          >
            {({ handleSubmit, values }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  <GovernanceField
                    title="Registry Name"
                    name="name"
                    type="input"
                    placeholder="Enter a name"
                  />
                  <GovernanceField
                    title="Registry Symbol"
                    required
                    name="symbol"
                    type="input"
                    placeholder="Enter a Symbol"
                  />
                  <GovernanceField
                    title="Registrar Address"
                    required
                    name="registrar"
                    type="input"
                    placeholder="Enter Registrar address"
                  />
                  <GovernanceDialogSelectLargeField
                    name="enumerable"
                    title="Enumerable Tokens"
                    type="select"
                    placeholder={"select action"}
                    required={true}
                    options={[
                      {
                        primaryText: "Enabled",
                        secondaryText: undefined,
                        action: null,
                        value: true,
                      },
                      {
                        primaryText: "Disabled",
                        secondaryText: undefined,
                        action: null,
                        value: false,
                      },
                    ]}
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
                      className={classes.button}
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={!values.registrar || !values.name}
                    >
                      Submit
                    </GovernanceButton>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Box>
      }
    />
  );
};

export default CreateRegistryWidget;
