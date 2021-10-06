import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceEditableValueWithTitle,
  GovernanceValueWithTitle,
  GovernanceWidgetHeader,
} from "@web-ui/components";
import { IRegistryEntryDetailWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { EthereumAddress, RegistryEntry } from "@hypernetlabs/objects";
import {
  GovernanceTag,
  ETagColor,
} from "@web-integration/components/GovernanceTag";

const RegistryEntryDetailWidget: React.FC<IRegistryEntryDetailWidgetParams> = ({
  onRegistryEntryListNavigate,
  registryName,
  entryLabel,
}: IRegistryEntryDetailWidgetParams) => {
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [registryEntry, setRegistryEntry] = useState<RegistryEntry>();
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>(
    EthereumAddress(""),
  );

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

  return (
    <Box>
      <GovernanceWidgetHeader
        label="Registry Entry Details"
        {...(accountAddress &&
          registryEntry && {
            description: isOwner ? (
              <Box display="flex">
                <GovernanceTag text="Owner" color={ETagColor.GREEN} />
                <Box paddingLeft={2}>
                  <Typography variant="body1" color="textPrimary">
                    You can update the Identity Data information.
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box display="flex">
                <GovernanceTag text="Viewer" color={ETagColor.PURPLE} />
                <Box paddingLeft={2}>
                  <Typography variant="body1" color="textPrimary">
                    You can copy the Identity Data information.
                  </Typography>
                </Box>
              </Box>
            ),
          })}
        navigationLink={{
          label: "Registry Entries",
          onClick: () => {
            onRegistryEntryListNavigate?.(registryName);
          },
        }}
      />
      {registryEntry && (
        <Box>
          {registryEntry?.canUpdateLabel && isOwner ? (
            <GovernanceEditableValueWithTitle
              title="Label"
              value={registryEntry?.label}
              onSave={(newValue) => {
                updateLabel(newValue);
              }}
            />
          ) : (
            <GovernanceValueWithTitle
              title="Label"
              value={registryEntry?.label}
            />
          )}
          <GovernanceValueWithTitle
            title="Token ID"
            value={registryEntry?.tokenId}
          />
          {registryEntry?.tokenURI &&
            (registryEntry?.canUpdateURI && isOwner ? (
              <GovernanceEditableValueWithTitle
                title="Token URI"
                value={registryEntry?.tokenURI}
                onSave={(newValue) => {
                  updateTokenURI(newValue);
                }}
              />
            ) : (
              <GovernanceValueWithTitle
                title="Token URI"
                value={registryEntry?.tokenURI}
              />
            ))}
        </Box>
      )}
    </Box>
  );
};

export default RegistryEntryDetailWidget;
