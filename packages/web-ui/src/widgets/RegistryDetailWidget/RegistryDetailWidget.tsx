import {
  EthereumAccountAddress,
  Registry,
  RegistryParams,
  BigNumberString,
  EthereumContractAddress,
  RegistryModule,
} from "@hypernetlabs/objects";
import { Box, Typography } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { IRegistryDetailWidgetParams } from "@web-ui/interfaces";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";

import {
  GovernanceChip,
  GovernanceCard,
  GovernanceWidgetHeader,
  GovernanceField,
  GovernanceButton,
  GovernanceSwitch,
} from "@web-ui/components";
import GrantRoleWidget from "@web-ui/widgets/GrantRoleWidget";
import { useStyles } from "@web-ui/widgets/RegistryDetailWidget/RegistryDetailWidget.style";
import RenounceRoleWidget from "@web-ui/widgets/RenounceRoleWidget";
import RevokeRoleWidget from "@web-ui/widgets/RevokeRoleWidget";

interface IRegistryDetailFormValus {
  symbol: string;
  numberOfEntries: number;
  registrationFee: BigNumberString;
  primaryRegistry: string;
  registrationToken: string;
  burnAddress: string;
  burnFee: string;
  baseURI: string;
  allowStorageUpdate: boolean;
  allowLabelChange: boolean;
  allowTransfers: boolean;
}

const RegistryDetailWidget: React.FC<IRegistryDetailWidgetParams> = ({
  onRegistryListNavigate,
  registryName,
}: IRegistryDetailWidgetParams) => {
  const classes = useStyles();
  const { coreProxy } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();
  const [registry, setRegistry] = useState<Registry>();
  const [registryModules, setRegistryModules] = useState<RegistryModule[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [accountAddress, setAccountAddress] = useState<EthereumAccountAddress>(
    EthereumAccountAddress(""),
  );
  const [grantRoleModalOpen, setGrantRoleModalOpen] = useState<boolean>(false);
  const [revokeRoleModalOpen, setRevokeRoleModalOpen] =
    useState<boolean>(false);
  const [renounceRoleModalOpen, setRenounceRoleModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    coreProxy.getEthereumAccounts().map((accounts) => {
      setAccountAddress(accounts[0]);
    });
  }, []);

  useEffect(() => {
    getRegistryDetails();
    getRegistryModules();
  }, []);

  const getRegistryDetails = () => {
    setLoading(true);
    coreProxy
      .getRegistryByName([registryName])
      .map((registryMap) => {
        setRegistry(registryMap.get(registryName));
        setLoading(false);
      })

      .mapErr(handleCoreError);
  };

  const getRegistryModules = () => {
    setLoading(true);
    coreProxy
      .getRegistryModules()
      .map((registryModules) => {
        setRegistryModules(registryModules);
        setLoading(false);
      })

      .mapErr(handleCoreError);
  };

  const updateRegistryParams = ({
    registrationFee,
    registrationToken,
    burnAddress,
    burnFee,
    baseURI,
    allowStorageUpdate,
    allowLabelChange,
    allowTransfers,
  }: IRegistryDetailFormValus) => {
    setLoading(true);
    coreProxy
      .updateRegistryParams(
        new RegistryParams(
          registryName,
          allowStorageUpdate,
          allowLabelChange,
          allowTransfers,
          EthereumContractAddress(registrationToken),
          registrationFee,
          EthereumAccountAddress(burnAddress),
          Number(burnFee) * 100,
          baseURI,
        ),
      )
      .map((registry) => {
        setRegistry(registry);
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const updateRegistrarRole = (
    value: boolean,
    moduleAddress: EthereumContractAddress,
  ) => {
    if (registry?.name == null) {
      return;
    }
    setLoading(true);
    if (value) {
      coreProxy
        .grantRegistrarRole(registry?.name, moduleAddress)
        .map(() => {
          getRegistryDetails();
        })
        .mapErr(handleCoreError);
    } else {
      coreProxy
        .revokeRegistrarRole(registry?.name, moduleAddress)
        .map(() => {
          getRegistryDetails();
        })
        .mapErr(handleCoreError);
    }
  };

  const isRegistrar = registry?.registrarAddresses.some(
    (address) => address === accountAddress,
  );

  return (
    <>
      {registry && (
        <>
          <GovernanceWidgetHeader
            label={registry.name}
            description={
              <Box>
                <Box className={classes.headerDescriptionContainer}>
                  <Typography>Address:</Typography>
                  <GovernanceChip
                    className={classes.addressChip}
                    label={registry?.address}
                    color="gray"
                  />
                </Box>
                <Box className={classes.headerDescriptionContainer}>
                  <Typography>Registrar Addresses:</Typography>
                  <Box display="flex" flexDirection="column">
                    {registry?.registrarAddresses.map((registrarAddress) => (
                      <GovernanceChip
                        className={classes.addressChip}
                        label={registrarAddress}
                        color="gray"
                      />
                    ))}
                  </Box>
                </Box>
                <Box className={classes.headerDescriptionContainer}>
                  <Typography>Registrar Admin Addresses:</Typography>
                  <GovernanceChip
                    className={classes.addressChip}
                    label={registry?.registrarAdminAddresses.join("-")}
                    color="gray"
                  />
                </Box>
              </Box>
            }
            navigationLink={{
              label: "Registries",
              onClick: () => {
                onRegistryListNavigate?.();
              },
            }}
            rightContent={
              <Box display="flex" flexDirection="row">
                <GovernanceButton
                  color="secondary"
                  size="medium"
                  onClick={() => {
                    setRevokeRoleModalOpen(true);
                  }}
                  variant="outlined"
                  disabled={!isRegistrar}
                >
                  Revoke Registrar
                </GovernanceButton>
                <Box marginLeft="10px">
                  <GovernanceButton
                    color="primary"
                    size="medium"
                    onClick={() => {
                      setRenounceRoleModalOpen(true);
                    }}
                    variant="outlined"
                    disabled={!isRegistrar}
                  >
                    Renounce Registrar
                  </GovernanceButton>
                </Box>
                <Box marginLeft="10px">
                  <GovernanceButton
                    color="primary"
                    size="medium"
                    onClick={() => {
                      setGrantRoleModalOpen(true);
                    }}
                    variant="contained"
                    disabled={!isRegistrar}
                  >
                    Grant Registrar
                  </GovernanceButton>
                </Box>
              </Box>
            }
          />

          <Formik
            enableReinitialize
            initialValues={
              {
                symbol: registry.symbol,
                numberOfEntries: registry.numberOfEntries,
                registrationFee: registry.registrationFee,
                primaryRegistry: registry.primaryRegistry,
                registrationToken: registry.registrationToken,
                burnAddress: registry.burnAddress,
                burnFee: (registry.burnFee / 100).toString(),
                baseURI: registry.baseURI,
                allowStorageUpdate: registry.allowStorageUpdate,
                allowLabelChange: registry.allowLabelChange,
                allowTransfers: registry.allowTransfers,
              } as IRegistryDetailFormValus
            }
            onSubmit={updateRegistryParams}
          >
            {({ handleSubmit, setFieldValue }) => {
              return (
                <Form className={classes.form} onSubmit={handleSubmit}>
                  <GovernanceCard>
                    <GovernanceField
                      disabled
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
                      {...(isEditing && { className: classes.editableField })}
                      disabled={!isEditing}
                      name="registrationFee"
                      title="Registration Fee"
                      type="input"
                    />
                    <GovernanceField
                      {...(isEditing && { className: classes.editableField })}
                      name="primaryRegistry"
                      title="Primary Registry"
                      type="input"
                      disabled={true}
                    />
                    <GovernanceField
                      {...(isEditing && { className: classes.editableField })}
                      disabled={!isEditing}
                      name="registrationToken"
                      title="Registration Token"
                      type="input"
                    />
                    <GovernanceField
                      {...(isEditing && { className: classes.editableField })}
                      disabled={!isEditing}
                      name="burnAddress"
                      title="Burn Address"
                      type="input"
                    />
                    <GovernanceField
                      {...(isEditing && { className: classes.editableField })}
                      disabled={!isEditing}
                      name="burnFee"
                      title="Burn Fee"
                      type="input"
                    />
                    <GovernanceField
                      {...(isEditing && { className: classes.editableField })}
                      disabled={!isEditing}
                      name="baseURI"
                      title="base URI"
                      type="input"
                    />
                  </GovernanceCard>
                  <GovernanceCard className={classes.optionsContainer}>
                    <Box className={classes.optionsRow} mb={3}>
                      <Box className={classes.switchContainer}>
                        <Typography className={classes.switchTitle}>
                          Allow Storage Update
                        </Typography>
                        <GovernanceSwitch
                          initialValue={registry.allowStorageUpdate}
                          onChange={(value) => {
                            setFieldValue("allowStorageUpdate", value);
                          }}
                          disabled={!isEditing}
                        />
                      </Box>
                    </Box>

                    <Box className={classes.optionsRow}>
                      <Box className={classes.switchContainer}>
                        <Typography className={classes.switchTitle}>
                          Allow Label Change
                        </Typography>
                        <GovernanceSwitch
                          initialValue={registry.allowLabelChange}
                          onChange={(value) => {
                            setFieldValue("allowLabelChange", value);
                          }}
                          disabled={!isEditing}
                        />
                      </Box>
                      <Box className={classes.switchContainer}>
                        <Typography className={classes.switchTitle}>
                          Allow Transfers
                        </Typography>
                        <GovernanceSwitch
                          initialValue={registry.allowTransfers}
                          onChange={(value) => {
                            setFieldValue("allowTransfers", value);
                          }}
                          disabled={!isEditing}
                        />
                      </Box>
                    </Box>
                  </GovernanceCard>

                  {!!registryModules.length && (
                    <GovernanceCard className={classes.optionsContainer}>
                      <Box className={classes.optionsRow}>
                        {registryModules.map((registryModule) => (
                          <Box
                            className={classes.switchContainer}
                            key={registryModule.address}
                          >
                            <Typography className={classes.switchTitle}>
                              {registryModule.name}
                            </Typography>
                            <GovernanceSwitch
                              initialValue={registry.registrarAddresses.includes(
                                registryModule.address,
                              )}
                              onChange={(value) => {
                                updateRegistrarRole(
                                  value,
                                  registryModule.address,
                                );
                              }}
                              disabled={!isEditing}
                            />
                          </Box>
                        ))}
                      </Box>
                    </GovernanceCard>
                  )}

                  {isRegistrar && (
                    <>
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
                    </>
                  )}
                </Form>
              );
            }}
          </Formik>

          {grantRoleModalOpen && (
            <GrantRoleWidget
              onCloseCallback={() => {
                getRegistryDetails();
                setGrantRoleModalOpen(false);
              }}
              registrarName={registryName}
            />
          )}
          {revokeRoleModalOpen && (
            <RevokeRoleWidget
              onCloseCallback={() => {
                getRegistryDetails();
                setRevokeRoleModalOpen(false);
              }}
              registrarName={registryName}
            />
          )}
          {renounceRoleModalOpen && (
            <RenounceRoleWidget
              onCloseCallback={() => {
                getRegistryDetails();
                setRenounceRoleModalOpen(false);
              }}
              registrarName={registryName}
            />
          )}
        </>
      )}
    </>
  );
};

export default RegistryDetailWidget;
