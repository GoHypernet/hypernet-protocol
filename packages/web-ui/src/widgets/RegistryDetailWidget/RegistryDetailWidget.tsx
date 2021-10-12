import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import { useAlert } from "react-alert";
import { Form, Formik } from "formik";

import {
  GovernanceChip,
  GovernanceCard,
  GovernanceWidgetHeader,
  GovernanceField,
  GovernanceButton,
} from "@web-ui/components";
import { IRegistryDetailWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { EthereumAddress, Registry } from "@hypernetlabs/objects";
import { useStyles } from "@web-ui/widgets/RegistryDetailWidget/RegistryDetailWidget.style";

const RegistryDetailWidget: React.FC<IRegistryDetailWidgetParams> = ({
  onRegistryListNavigate,
  registryName,
}: IRegistryDetailWidgetParams) => {
  const alert = useAlert();
  const classes = useStyles();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [registry, setRegistry] = useState<Registry>();
  const [numberOfEntries, setNumberOfEntries] = useState<number>();
  const [isEditing, setIsEditing] = useState(false);
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>(
    EthereumAddress(""),
  );

  useEffect(() => {
    coreProxy.getEthereumAccounts().map((accounts) => {
      setAccountAddress(accounts[0]);
    });
  }, []);

  useEffect(() => {
    coreProxy
      .getRegistryEntriesTotalCount([registryName])
      .map((countsMap) => {
        const count = countsMap.get(registryName);
        setNumberOfEntries(count || 0);
      })
      .mapErr(handleError);
  }, []);

  useEffect(() => {
    setLoading(true);

    coreProxy
      .getRegistryByName([registryName])
      .map((registryMap) => {
        setRegistry(registryMap.get(registryName));
        setLoading(false);
      })

      .mapErr(handleError);
  }, []);

  const handleError = (err?: Error) => {
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  const handleSave = () => {};

  return (
    <>
      {registry && (
        <>
          <GovernanceWidgetHeader
            label={registry.name}
            description={
              <Box className={classes.headerDescriptionContainer}>
                <Typography>Address:</Typography>
                <GovernanceChip
                  className={classes.addressChip}
                  label={registry?.address}
                  color="gray"
                />
              </Box>
            }
            navigationLink={{
              label: "Registries",
              onClick: () => {
                onRegistryListNavigate?.();
              },
            }}
          />

          <Formik
            enableReinitialize
            initialValues={{
              symbol: registry.symbol,
              numberOfEntries,
              // numberOfEntries: 1,
              // registrationFee: 1,
              registrarAddress: registry.registrarAddresses,
              //registrationToken: registry.?,
            }}
            onSubmit={handleSave}
          >
            {({ handleSubmit, values }) => {
              return (
                <Form className={classes.form} onSubmit={handleSubmit}>
                  <GovernanceCard>
                    <GovernanceField
                      required
                      disabled={!isEditing}
                      name="symbol"
                      title="Symbol"
                      type="input"
                    />
                    <GovernanceField
                      disabled
                      name="numberOfEntries"
                      title="Number of Entries"
                      type="input"
                    />
                    <GovernanceField
                      disabled
                      name="numberOfEntries"
                      title="Registration Fee"
                      type="input"
                    />
                    <GovernanceField
                      disabled
                      name="registrarAddress"
                      title="Registrar Address"
                      type="input"
                    />
                    <GovernanceField
                      disabled
                      name="registrationToken"
                      title="Registration Token"
                      type="input"
                    />
                  </GovernanceCard>
                  <GovernanceCard className={classes.optionsContainer}>
                    <Box className={classes.optionsRow}>
                      <Typography>Allow Lazy Register</Typography>
                      <Typography>Allow Storage Update</Typography>
                    </Box>

                    <Box className={classes.optionsRow}>
                      <Typography>Allow Label Change</Typography>
                      <Typography>Allow Transfers</Typography>
                    </Box>
                  </GovernanceCard>

                  {isEditing ? (
                    <GovernanceButton
                      className={classes.button}
                      color="primary"
                      variant="outlined"
                      onClick={handleSubmit}
                    >
                      Save Changes
                    </GovernanceButton>
                  ) : (
                    <GovernanceButton
                      className={classes.button}
                      color="primary"
                      variant="outlined"
                      onClick={() => {
                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </GovernanceButton>
                  )}
                </Form>
              );
            }}
          </Formik>
        </>
      )}
    </>
  );
};

export default RegistryDetailWidget;
