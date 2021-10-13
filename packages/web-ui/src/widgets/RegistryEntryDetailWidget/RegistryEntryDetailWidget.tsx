import React, { useEffect, useMemo, useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@material-ui/core";
import { FileCopy as FileCopyIcon } from "@material-ui/icons";
import { Form, Formik } from "formik";
import { useAlert } from "react-alert";

import {
  GovernanceButton,
  GovernanceCard,
  GovernanceField,
  GovernanceWidgetHeader,
} from "@web-ui/components";
import { IRegistryEntryDetailWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import {
  EthereumAddress,
  Registry,
  RegistryEntry,
} from "@hypernetlabs/objects";
import {
  GovernanceTag,
  ETagColor,
} from "@web-integration/components/GovernanceTag";
import BurnEntryWidget from "../BurnEntryWidget";
import TransferIdentityWidget from "../TransferIdentityWidget";
import { colors } from "@web-ui/theme";
import { useStyles } from "@web-ui/widgets/RegistryEntryDetailWidget/RegistryEntryDetailWidget.style";

interface IRegistryEntryFormValues {
  label: string;
  tokenId: string;
  recipientAddress: string;
  tokenURI: string;
}

const RegistryEntryDetailWidget: React.FC<IRegistryEntryDetailWidgetParams> = ({
  onRegistryEntryListNavigate,
  registryName,
  entryLabel,
}: IRegistryEntryDetailWidgetParams) => {
  const alert = useAlert();
  const classes = useStyles();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [registryEntry, setRegistryEntry] = useState<RegistryEntry>();
  const [registry, setRegistry] = useState<Registry>();

  const [burnEntryModalOpen, setBurnEntryModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [transferIdentityModalOpen, setTransferIdentityModalOpen] =
    useState<boolean>(false);
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>(
    EthereumAddress(""),
  );
  const [isCopyTooltipOpen, setIsCopyTooltipOpen] = useState(false);

  useEffect(() => {
    coreProxy.getEthereumAccounts().map((accounts) => {
      setAccountAddress(accounts[0]);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    coreProxy
      .getRegistryEntryByLabel(registryName, entryLabel)
      .map((registryEntry: RegistryEntry) => {
        setRegistryEntry(registryEntry);
        setLoading(false);
      })
      .mapErr(handleError);
  }, []);

  useEffect(() => {
    coreProxy
      .getRegistryByName([registryName])
      .map((registryMap) => {
        setRegistry(registryMap.get(registryName));
        setLoading(false);
      })

      .mapErr(handleError);
  }, []);

  useEffect(() => {
    const toggleCopyTooltip = setInterval(() => {
      if (isCopyTooltipOpen) {
        setIsCopyTooltipOpen(false);
      }
    }, 2000);

    return () => clearInterval(toggleCopyTooltip);
  }, [isCopyTooltipOpen, useState]);

  const copyValueToClipboard = () => {
    navigator.clipboard.writeText(registryEntry?.tokenURI || "");
    setIsCopyTooltipOpen(true);
  };

  const updateLabel = (val: string) => {
    setLoading(true);
    coreProxy
      .updateRegistryEntryLabel(
        registryName,
        registryEntry?.tokenId as number,
        val,
      )
      .map((registryEntry: RegistryEntry) => {
        setRegistryEntry(registryEntry);
        setLoading(false);
      })
      .mapErr(handleError);
  };

  const updateTokenURI = (val: string) => {
    setLoading(true);
    coreProxy
      .updateRegistryEntryTokenURI(
        registryName,
        registryEntry?.tokenId as number,
        val,
      )
      .map((registryEntry: RegistryEntry) => {
        setRegistryEntry(registryEntry);
        setLoading(false);
      })
      .mapErr(handleError);
  };

  const handleError = (err?: Error) => {
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  const isOwner = useMemo(() => {
    if (!accountAddress || !registryEntry) {
      return false;
    }

    return accountAddress === registryEntry.owner;
  }, [accountAddress, registryEntry]);

  const handleSave = ({ label, tokenURI }: IRegistryEntryFormValues) => {
    if (tokenURI !== registryEntry?.tokenURI) {
      updateTokenURI(tokenURI);
    }
    if (label !== registryEntry?.label) {
      updateLabel(label);
    }
  };

  return (
    <Box>
      <GovernanceWidgetHeader
        label="Registry Entry Details"
        {...(accountAddress &&
          registryEntry && {
            description: isOwner ? (
              <Box className={classes.descriptionContainer}>
                <GovernanceTag text="Owner" color={ETagColor.GREEN} />
                <Typography
                  className={classes.descriptionText}
                  variant="body1"
                  color="textPrimary"
                >
                  You can update the Identity Data information.
                </Typography>
              </Box>
            ) : (
              <Box className={classes.descriptionContainer}>
                <GovernanceTag text="Viewer" color={ETagColor.PURPLE} />
                <Typography
                  className={classes.descriptionText}
                  variant="body1"
                  color="textPrimary"
                >
                  You can copy the Identity Data information.
                </Typography>
              </Box>
            ),
          })}
        navigationLink={{
          label: "Registry Entries",
          onClick: () => {
            onRegistryEntryListNavigate?.(registryName);
          },
        }}
        {...(isOwner &&
          registry?.allowTransfers && {
            headerActions: [
              {
                label: "Burn Entry",
                onClick: () => setBurnEntryModalOpen(true),
                variant: "contained",
                color: "secondary",
                style: { backgroundColor: colors.RED700 },
              },
              {
                label: "Transfer NFI",
                onClick: () => setTransferIdentityModalOpen(true),
                variant: "contained",
                color: "primary",
              },
            ],
          })}
      />
      {registryEntry && (
        <Formik
          enableReinitialize
          initialValues={{
            label: registryEntry.label,
            tokenId: registryEntry.tokenId.toString(),
            recipientAddress: registryEntry.owner,
            tokenURI: registryEntry?.tokenURI || "",
          }}
          onSubmit={handleSave}
        >
          {({ handleSubmit }) => {
            return (
              <Form className={classes.form} onSubmit={handleSubmit}>
                <GovernanceCard>
                  <Box className={classes.cardContainer}>
                    <Box className={classes.fieldContainer}>
                      <GovernanceField
                        disabled={!registryEntry?.canUpdateLabel || !isOwner}
                        title="Label"
                        name="label"
                        type="input"
                        placeholder="Enter the label"
                      />
                      <GovernanceField
                        disabled
                        title="Token ID"
                        name="tokenId"
                        type="input"
                      />
                      <GovernanceField
                        disabled
                        title="Recipient Address"
                        name="recipientAddress"
                        type="input"
                      />
                      <GovernanceField
                        disabled={!registryEntry?.canUpdateURI || !isOwner}
                        title="Token URI"
                        name="tokenURI"
                        type="input"
                        placeholder="Enter the Token URI"
                      />
                    </Box>
                    {registryEntry?.tokenURI && (
                      <Tooltip
                        open={isCopyTooltipOpen}
                        title="Copied!"
                        arrow
                        placement="top"
                      >
                        <IconButton
                          className={classes.copyIcon}
                          onClick={copyValueToClipboard}
                        >
                          <FileCopyIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </GovernanceCard>

                {isOwner &&
                  (isEditing ? (
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
                  ))}
              </Form>
            );
          }}
        </Formik>
      )}
      {burnEntryModalOpen && registryEntry?.tokenId && (
        <BurnEntryWidget
          registryName={registryName}
          tokenId={registryEntry.tokenId}
          onCloseCallback={() => setBurnEntryModalOpen(false)}
        />
      )}
      {transferIdentityModalOpen && (
        <TransferIdentityWidget
          onCloseCallback={() => setTransferIdentityModalOpen(false)}
        />
      )}
    </Box>
  );
};

export default RegistryEntryDetailWidget;
