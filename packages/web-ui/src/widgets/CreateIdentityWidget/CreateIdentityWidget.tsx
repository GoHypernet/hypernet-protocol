import {
  EthereumAccountAddress,
  RegistryEntry,
  RegistryTokenId,
} from "@hypernetlabs/objects";
import { Box, Typography } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { Form, Formik } from "formik";
import React, { useState } from "react";

import {
  GovernanceDialog,
  GovernanceButton,
  GovernanceField,
  GovernanceSwitch,
} from "@web-ui/components";
import { useStyles } from "@web-ui/widgets/CreateIdentityWidget/CreateIdentityWidget.style";

interface ICreateIdentityWidget {
  onCloseCallback: () => void;
  registryName: string;
  currentAccountAddress: EthereumAccountAddress;
  lazyMintModeEnabled?: boolean;
}

interface ICreateIdentityFormValues {
  label: string;
  recipientAddress: string;
  tokenUri: string;
  tokenId: string;
}

const CreateIdentityWidget: React.FC<ICreateIdentityWidget> = ({
  onCloseCallback,
  registryName,
  currentAccountAddress,
  lazyMintModeEnabled,
}: ICreateIdentityWidget) => {
  const classes = useStyles();
  const { coreProxy } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();
  const [generateRandomTokenIdSwitch, setGenerateRandomTokenIdSwitch] =
    useState<boolean>(true);

  const handleCreateIdentity = ({
    label,
    recipientAddress,
    tokenUri,
    tokenId,
  }: ICreateIdentityFormValues) => {
    setLoading(true);

    coreProxy
      .createRegistryEntry(
        registryName,
        new RegistryEntry(
          label,
          RegistryTokenId(Number(tokenId)),
          EthereumAccountAddress(recipientAddress),
          tokenUri,
          null,
        ),
      )
      .map(() => {
        setLoading(false);
        onCloseCallback();
      })
      .mapErr(handleCoreError);
  };

  const handlLazyMintIdentity = ({
    recipientAddress,
    tokenUri,
    tokenId,
  }: ICreateIdentityFormValues) => {
    setLoading(true);

    coreProxy
      .submitLazyMintSignature(
        registryName,
        RegistryTokenId(Number(tokenId)),
        EthereumAccountAddress(recipientAddress),
        tokenUri,
      )
      .map(() => {
        setLoading(false);
        onCloseCallback();
      })
      .mapErr(handleCoreError);
  };

  const handleGenerateTokenIdSwitchChange = (
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined,
    ) => void,
    value: boolean,
  ) => {
    setGenerateRandomTokenIdSwitch(value);
    if (value === true) {
      setFieldValue(
        "tokenId",
        Math.floor(Math.random() * 10000000000).toString(),
      );
    } else {
      setFieldValue("tokenId", "");
    }
  };

  return (
    <GovernanceDialog
      title={lazyMintModeEnabled ? "" : "Create a New Identity"}
      isOpen={true}
      onClose={onCloseCallback}
      content={
        <Box className={classes.wrapper}>
          <Formik
            initialValues={{
              label: "",
              recipientAddress: currentAccountAddress,
              tokenUri: "",
              tokenId: Math.floor(Math.random() * 10000000000).toString(),
            }}
            onSubmit={(values) =>
              lazyMintModeEnabled
                ? handlLazyMintIdentity(values)
                : handleCreateIdentity(values)
            }
          >
            {({ handleSubmit, values, setFieldValue }) => {
              return (
                <Form onSubmit={handleSubmit}>
                  <Box className={classes.switchContainer}>
                    <Typography className={classes.switchTitle}>
                      Generate Random Token ID
                    </Typography>
                    <GovernanceSwitch
                      initialValue={generateRandomTokenIdSwitch}
                      onChange={(value) => {
                        handleGenerateTokenIdSwitchChange(setFieldValue, value);
                      }}
                    />
                  </Box>
                  <GovernanceField
                    title="Token id"
                    name="tokenId"
                    type="input"
                    placeholder="Enter a number for your token"
                  />
                  {!lazyMintModeEnabled && (
                    <GovernanceField
                      title="Label"
                      name="label"
                      type="input"
                      placeholder="Enter a label"
                    />
                  )}
                  <GovernanceField
                    title="Recipient Address"
                    required
                    name="recipientAddress"
                    type="input"
                    placeholder="Enter the recipient address"
                  />
                  <GovernanceField
                    title="Token URI"
                    required
                    name="tokenUri"
                    type="input"
                    placeholder="Enter the token URI"
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
                      disabled={!values.recipientAddress || !values.tokenUri}
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

export default CreateIdentityWidget;
