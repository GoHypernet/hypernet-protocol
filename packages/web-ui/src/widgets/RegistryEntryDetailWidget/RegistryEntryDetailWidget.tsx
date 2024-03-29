import {
  EthereumAccountAddress,
  Registry,
  RegistryEntry,
  RegistryTokenId,
} from "@hypernetlabs/objects";
import { Box } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { IRegistryEntryDetailWidgetParams } from "@web-ui/interfaces";
import React, { useEffect, useMemo, useState } from "react";

import BurnEntryWidget from "../BurnEntryWidget";
import TransferIdentityWidget from "../TransferIdentityWidget";

import {
  GovernanceCard,
  GovernanceEditableValueWithTitle,
  GovernanceValueWithTitle,
  GovernanceWidgetHeader,
  IHeaderAction,
} from "@web-ui/components";
import { GovernanceTag, ETagColor } from "@web-ui/components/GovernanceTag";
import { colors } from "@web-ui/theme";

const RegistryEntryDetailWidget: React.FC<IRegistryEntryDetailWidgetParams> = ({
  onRegistryEntryListNavigate,
  registryName,
  entryTokenId,
}: IRegistryEntryDetailWidgetParams) => {
  const { coreProxy } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();
  const [registryEntry, setRegistryEntry] = useState<RegistryEntry>();
  const [registry, setRegistry] = useState<Registry>();
  const [accountAddress, setAccountAddress] = useState<EthereumAccountAddress>(
    EthereumAccountAddress(""),
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
    coreProxy.registries
      .getRegistryEntryDetailByTokenId(registryName, entryTokenId)
      .map((registryEntry: RegistryEntry) => {
        setRegistryEntry(registryEntry);
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const getRegistryByName = () => {
    setLoading(true);
    coreProxy.registries
      .getRegistryByName([registryName])
      .map((registryMap) => {
        setRegistry(registryMap.get(registryName));
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const updateLabel = (val: string) => {
    setLoading(true);
    coreProxy.registries
      .updateRegistryEntryLabel(
        registryName,
        registryEntry?.tokenId as RegistryTokenId,
        val,
      )
      .map((registryEntry: RegistryEntry) => {
        setRegistryEntry(registryEntry);
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const updateTokenURI = (val: string) => {
    setLoading(true);
    coreProxy.registries
      .updateRegistryEntryTokenURI(
        registryName,
        registryEntry?.tokenId as RegistryTokenId,
        val,
      )
      .map((registryEntry: RegistryEntry) => {
        setRegistryEntry(registryEntry);
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const isRegistrar = useMemo(() => {
    return registry?.registrarAddresses.some(
      (address) => address === accountAddress,
    );
  }, [accountAddress, JSON.stringify(registry?.registrarAddresses)]);

  const isOwner = useMemo(() => {
    return accountAddress === registryEntry?.owner;
  }, [accountAddress, registryEntry]);

  const canUpdateLabel = useMemo(() => {
    return isRegistrar || (isOwner && registry?.allowLabelChange);
  }, [isRegistrar, isOwner]);

  const canUpdateTokenURI = useMemo(() => {
    return isRegistrar || (isOwner && registry?.allowStorageUpdate);
  }, [isRegistrar, isOwner]);

  const getHeaderActions: () => IHeaderAction[] = () => {
    const canTransfer = useMemo(() => {
      return isRegistrar || (isOwner && registry?.allowTransfers);
    }, [isRegistrar, isOwner]);

    const canBurn = useMemo(() => {
      return isRegistrar || isOwner;
    }, [isRegistrar, isOwner]);

    const headerActions: IHeaderAction[] = [];

    if (canBurn) {
      headerActions.push({
        label: "Burn Entry",
        onClick: () => setBurnEntryModalOpen(true),
        variant: "contained",
        color: "secondary",
        style: { backgroundColor: colors.RED700 },
      });
    }

    if (canTransfer) {
      headerActions.push({
        label: "Transfer NFI",
        onClick: () => setTransferIdentityModalOpen(true),
        variant: "contained",
        color: "primary",
      });
    }

    return headerActions;
  };

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
        headerActions={getHeaderActions()}
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
