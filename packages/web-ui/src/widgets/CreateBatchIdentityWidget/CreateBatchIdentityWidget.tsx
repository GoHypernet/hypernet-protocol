import {
  EthereumAccountAddress,
  RegistryEntry,
  RegistryTokenId,
} from "@hypernetlabs/objects";
import { Box, Typography } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { Form, Formik, FormikState } from "formik";
import React, { useState } from "react";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";

import {
  GovernanceDialog,
  GovernanceButton,
  GovernanceField,
  GovernanceSwitch,
} from "@web-ui/components";
import { useStyles } from "@web-ui/widgets/CreateBatchIdentityWidget/CreateBatchIdentityWidget.style";

interface CreateBatchIdentityWidget {
  onCloseCallback: () => void;
  registryName: string;
  currentAccountAddress: EthereumAccountAddress;
}

interface ICreateIdentityFormValues {
  label: string;
  recipientAddress: string;
  tokenUri: string;
  tokenId: string;
}

const CreateBatchIdentityWidget: React.FC<CreateBatchIdentityWidget> = ({
  onCloseCallback,
  registryName,
  currentAccountAddress,
}: CreateBatchIdentityWidget) => {
  const classes = useStyles();
  const { coreProxy } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();
  const [generateRandomTokenIdSwitch, setGenerateRandomTokenIdSwitch] =
    useState<boolean>(true);
  const [createdEntries, setCreatedEntries] = useState<RegistryEntry[]>([]);

  const handleCreateIdentity = ({
    label,
    recipientAddress,
    tokenUri,
    tokenId,
  }: ICreateIdentityFormValues) => {
    setLoading(true);
    const registryEntries = [...createdEntries];
    if (label != "" && tokenId != "" && recipientAddress != "") {
      registryEntries.push(
        new RegistryEntry(
          label,
          RegistryTokenId(Number(tokenId)),
          EthereumAccountAddress(recipientAddress),
          tokenUri,
          null,
        ),
      );
    }

    coreProxy.registries
      .createBatchRegistryEntry(registryName, registryEntries)
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

  const handleAddMoreEntries = (
    resetForm: (
      nextState?:
        | Partial<
            FormikState<{
              label: string;
              recipientAddress: EthereumAccountAddress;
              tokenUri: string;
              tokenId: string;
            }>
          >
        | undefined,
    ) => void,
    values: ICreateIdentityFormValues,
  ) => {
    setCreatedEntries((prevState) => {
      return [
        ...prevState,
        new RegistryEntry(
          values.label,
          RegistryTokenId(Number(values.tokenId)),
          EthereumAccountAddress(values.recipientAddress),
          values.tokenUri,
          null,
        ),
      ];
    });
    resetForm({
      values: {
        tokenUri: "",
        label: "",
        recipientAddress: currentAccountAddress,
        tokenId: Math.floor(Math.random() * 10000000000).toString(),
      },
    });
  };

  const removeCreatedEntry = (index: number) => {
    setCreatedEntries((prevState) => {
      return [...prevState.filter((entry, entryIndex) => entryIndex !== index)];
    });
  };

  return (
    <GovernanceDialog
      title="Create Batch Identity"
      isOpen={true}
      onClose={onCloseCallback}
      content={
        <Box className={classes.wrapper}>
          <Box className={classes.createdEntries}>
            {createdEntries.map((registryEntry, index) => (
              <Box key={index} display="flex" justifyContent="space-between">
                <Typography>{`${registryEntry.tokenId} ${
                  registryEntry.label ? ` - ${registryEntry.label}` : ""
                }`}</Typography>
                <Box
                  onClick={() => removeCreatedEntry(index)}
                  className={classes.removeIcon}
                >
                  <RemoveCircleOutlineIcon />
                </Box>
              </Box>
            ))}
          </Box>
          <Formik
            initialValues={{
              label: "",
              recipientAddress: currentAccountAddress,
              tokenUri: "",
              tokenId: Math.floor(Math.random() * 10000000000).toString(),
            }}
            onSubmit={handleCreateIdentity}
          >
            {({ handleSubmit, values, setFieldValue, resetForm }) => {
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
                  <GovernanceField
                    title="Label"
                    name="label"
                    type="input"
                    placeholder="Enter a label"
                  />
                  <GovernanceField
                    title="Recipient Address"
                    name="recipientAddress"
                    type="input"
                    placeholder="Enter the recipient address"
                  />
                  <GovernanceField
                    title="Token URI"
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
                      color="secondary"
                      onClick={() => handleAddMoreEntries(resetForm, values)}
                      disabled={!values.recipientAddress || !values.label}
                    >
                      Add More
                    </GovernanceButton>
                    <GovernanceButton
                      className={classes.button}
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={!values.tokenId && createdEntries.length === 0}
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

export default CreateBatchIdentityWidget;
