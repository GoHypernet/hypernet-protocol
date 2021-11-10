import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@material-ui/core";

import { useAlert } from "react-alert";

import {
  GovernanceCard,
  GovernanceEditableValueWithTitle,
  GovernanceValueWithTitle,
  GovernanceWidgetHeader,
} from "@web-ui/components";
import { IRegistryEntryDetailWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import {
  EthereumAddress,
  Registry,
  RegistryEntry,
} from "@hypernetlabs/objects";
import { GovernanceTag, ETagColor } from "@web-ui/components/GovernanceTag";
import BurnEntryWidget from "../BurnEntryWidget";
import TransferIdentityWidget from "../TransferIdentityWidget";
import { colors } from "@web-ui/theme";

const RegistryEntryDetailWidget: React.FC<IRegistryEntryDetailWidgetParams> = ({
  onRegistryEntryListNavigate,
  registryName,
  entryTokenId,
}: IRegistryEntryDetailWidgetParams) => {
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [registryEntry, setRegistryEntry] = useState<RegistryEntry>();
  const [registry, setRegistry] = useState<Registry>();
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>(
    EthereumAddress(""),
  );
  const [burnEntryModalOpen, setBurnEntryModalOpen] = useState<boolean>(false);
  const [transferIdentityModalOpen, setTransferIdentityModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    getAccount();
  }, []);

  useEffect(() => {
    getRegistryEntryByLabel();
  }, []);

  useEffect(() => {
    getRegistryByName();
  }, []);

  const getAccount = () => {
    coreProxy.getEthereumAccounts().map((accounts) => {
      setAccountAddress(accounts[0]);
    });
  };

  const getRegistryEntryByLabel = () => {
    setLoading(true);
    coreProxy
      .getRegistryEntryDetailByTokenId(registryName, entryTokenId)
      .map((registryEntry: RegistryEntry) => {
        setRegistryEntry(registryEntry);
        setLoading(false);
      })
      .mapErr(handleError);
  };

  const getRegistryByName = () => {
    setLoading(true);
    coreProxy
      .getRegistryByName([registryName])
      .map((registryMap) => {
        setRegistry(registryMap.get(registryName));
        setLoading(false);
      })
      .mapErr(handleError);
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

  const handleError = (err) => {
    setLoading(false);
    alert.error(
      err?.src?.data?.message || err?.message || "Something went wrong!",
    );
  };

  const isRegistrar = useMemo(() => {
    return registry?.registrarAddresses.some(
      (address) => address === accountAddress,
    );
  }, [accountAddress, JSON.stringify(registry?.registrarAddresses)]);

  const isOwner = useMemo(() => {
    return accountAddress === registryEntry?.owner;
  }, [accountAddress, registryEntry]);

  const canBurnOrTransfer = useMemo(() => {
    return isRegistrar || (isOwner && registry?.allowTransfers);
  }, [isRegistrar, isOwner]);

  const canUpdateLabel = useMemo(() => {
    return isRegistrar || (isOwner && registry?.allowLabelChange);
  }, [isRegistrar, isOwner]);

  const canUpdateTokenURI = useMemo(() => {
    return isRegistrar || (isOwner && registry?.allowStorageUpdate);
  }, [isRegistrar, isOwner]);

  return (
    <Box>
      <GovernanceWidgetHeader
        label="Registry Entry Details"
        {...(accountAddress &&
          registryEntry && {
            description:
              isOwner || isRegistrar ? (
                <GovernanceTag text="Owner" color={ETagColor.GREEN} />
              ) : (
                <GovernanceTag text="Viewer" color={ETagColor.PURPLE} />
              ),
          })}
        navigationLink={{
          label: "Registry Entries",
          onClick: () => {
            onRegistryEntryListNavigate?.(registryName);
          },
        }}
        {...(canBurnOrTransfer && {
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
        <GovernanceCard>
          {canUpdateLabel ? (
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
            value={registryEntry.tokenId}
          />
          <GovernanceValueWithTitle
            title="Current Owner"
            value={registryEntry.owner}
          />
          {canUpdateTokenURI ? (
            <GovernanceEditableValueWithTitle
              title="Identity Data"
              value={registryEntry?.tokenURI || ""}
              onSave={(newValue) => {
                updateTokenURI(newValue);
              }}
            />
          ) : (
            <GovernanceValueWithTitle
              title="Identity Data"
              value={registryEntry?.tokenURI || ""}
            />
          )}
        </GovernanceCard>
      )}
      {burnEntryModalOpen && registryEntry?.tokenId && (
        <BurnEntryWidget
          registryName={registryName}
          tokenId={registryEntry.tokenId}
          onSuccessCallback={() => {
            setBurnEntryModalOpen(false);
            onRegistryEntryListNavigate?.(registryName);
          }}
          onCloseCallback={() => {
            setBurnEntryModalOpen(false);
          }}
        />
      )}
      {transferIdentityModalOpen && registryEntry?.tokenId && (
        <TransferIdentityWidget
          registryName={registryName}
          tokenId={registryEntry.tokenId}
          onSuccessCallback={() => {
            setTransferIdentityModalOpen(false);
            onRegistryEntryListNavigate?.(registryName);
          }}
          onCloseCallback={() => {
            setTransferIdentityModalOpen(false);
          }}
        />
      )}
    </Box>
  );
};

export default RegistryEntryDetailWidget;
