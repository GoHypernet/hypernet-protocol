import React, { useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import { useAlert } from "react-alert";
import { Form, Formik } from "formik";

import {
  GovernanceChip,
  GovernanceCard,
  GovernanceWidgetHeader,
  GovernanceField,
  GovernanceButton,
  GovernanceSwitch,
} from "@web-ui/components";
import { IRegistryDetailWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import {
  EthereumAddress,
  Registry,
  RegistryParams,
  BigNumberString,
} from "@hypernetlabs/objects";
import { useStyles } from "@web-ui/widgets/RegistryDetailWidget/RegistryDetailWidget.style";
import GrantRoleWidget from "@web-ui/widgets/GrantRoleWidget";
import RevokeRoleWidget from "@web-ui/widgets/RevokeRoleWidget";
import RenounceRoleWidget from "@web-ui/widgets/RenounceRoleWidget";

interface IRegistryDetailFormValus {
  symbol: string;
  numberOfEntries: number;
  registrationFee: BigNumberString;
  primaryRegistry: string;
  registrationToken: string;
  burnAddress: string;
  burnFee: string;
  allowStorageUpdate: boolean;
  allowLabelChange: boolean;
  allowTransfers: boolean;
  allowLazyRegister: boolean;
}

const RegistryDetailWidget: React.FC<IRegistryDetailWidgetParams> = ({
  onRegistryListNavigate,
  registryName,
}: IRegistryDetailWidgetParams) => {
  const alert = useAlert();
  const classes = useStyles();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [registry, setRegistry] = useState<Registry>();
  const [isEditing, setIsEditing] = useState(false);
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>(
    EthereumAddress(""),
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
  }, []);

  const getRegistryDetails = () => {
    setLoading(true);
    coreProxy
      .getRegistryByName([registryName])
      .map((registryMap) => {
        setRegistry(registryMap.get(registryName));
        setLoading(false);
      })

      .mapErr(handleError);
  };

  const handleError = (err?: Error) => {
    setLoading(false);
    setIsEditing(false);
    alert.error(err?.message || "Something went wrong!");
  };

  const updateRegistryParams = ({
    registrationFee,
    primaryRegistry,
    registrationToken,
    burnAddress,
    burnFee,
    allowStorageUpdate,
    allowLabelChange,
    allowTransfers,
    allowLazyRegister,
  }: IRegistryDetailFormValus) => {
    setLoading(true);
    coreProxy
      .updateRegistryParams(
        new RegistryParams(
          registryName,
          allowLazyRegister,
          allowStorageUpdate,
          allowLabelChange,
          allowTransfers,
          EthereumAddress(registrationToken),
          registrationFee,
          EthereumAddress(burnAddress),
          Number(burnFee) * 100,
          EthereumAddress(primaryRegistry),
        ),
      )
      .map((registry) => {
        setRegistry(registry);
        setLoading(false);
      })
      .mapErr(handleError);
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
            rightContent={
              <Box display="flex" flexDirection="row">
                <GovernanceButton
                  color="secondary"
                  size="medium"
                  onClick={() => {
                    setRevokeRoleModalOpen(true);
                  }}
                  variant="outlined"
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
                allowStorageUpdate: registry.allowStorageUpdate,
                allowLabelChange: registry.allowLabelChange,
                allowTransfers: registry.allowTransfers,
                allowLazyRegister: registry.allowLazyRegister,
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
                      disabled={!isEditing}
                      name="primaryRegistry"
                      title="Primary Registry"
                      type="input"
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
                  </GovernanceCard>
                  <GovernanceCard className={classes.optionsContainer}>
                    <Box className={classes.optionsRow} mb={3}>
                      <Box className={classes.switchContainer}>
                        <Typography className={classes.switchTitle}>
                          Allow Lazy Register
                        </Typography>
                        <GovernanceSwitch
                          initialValue={registry.allowLazyRegister}
                          onChange={(value) => {
                            setFieldValue("allowLazyRegister", value);
                          }}
                          disabled={!isEditing}
                        />
                      </Box>
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
