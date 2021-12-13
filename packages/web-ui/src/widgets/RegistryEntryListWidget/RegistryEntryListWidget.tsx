import {
  ERegistrySortOrder,
  EthereumAccountAddress,
  Registry,
  RegistryEntry,
} from "@hypernetlabs/objects";
import { Box, Typography } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { IRegistryEntryListWidgetParams } from "@web-ui/interfaces";
import React, { useEffect, useState, useMemo } from "react";

import {
  GovernanceRegistryListItem,
  GovernanceWidgetHeader,
  GovernancePagination,
  GovernanceEmptyState,
  GovernanceSwitch,
  IHeaderAction,
  GovernanceSearchFilter,
} from "@web-ui/components";
import CreateIdentityWidget from "@web-ui/widgets/CreateIdentityWidget";
import CreateBatchIdentityWidget from "@web-ui/widgets/CreateBatchIdentityWidget";

const REGISTRY_ENTRIES_PER_PAGE = 3;

const RegistryEntryListWidget: React.FC<IRegistryEntryListWidgetParams> = ({
  onRegistryEntryDetailsNavigate,
  onRegistryListNavigate,
  registryName,
}: IRegistryEntryListWidgetParams) => {
  const { coreProxy, viewUtils } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();
  const [registryEntries, setRegistryEntries] = useState<RegistryEntry[]>([]);
  const [registry, setRegistry] = useState<Registry>();
  const [accountAddress, setAccountAddress] = useState<EthereumAccountAddress>(
    EthereumAccountAddress(""),
  );
  const [reversedSortingEnabled, setReversedSortingEnabled] =
    useState<boolean>(false);
  const [createIdentityModalOpen, setCreateIdentityModalOpen] =
    useState<boolean>(false);
  const [createBatchIdentityModalOpen, setCreateBatchIdentityModalOpen] =
    useState<boolean>(false);
  const [lazyMintModeEnabled, setLazyMintModeEnabled] =
    useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasEmptyState, setHasEmptyState] = useState<boolean>(false);

  useEffect(() => {
    getRegistry();
  }, []);

  useEffect(() => {
    if (registry?.numberOfEntries) {
      getRegistryEntries(page);
    }
  }, [registry?.numberOfEntries, page, REGISTRY_ENTRIES_PER_PAGE]);

  useEffect(() => {
    getRegistryEntries(1);
  }, [reversedSortingEnabled]);

  useEffect(() => {
    coreProxy.getEthereumAccounts().map((accounts) => {
      setAccountAddress(accounts[0]);
    });
  }, []);

  const getRegistry = () => {
    setLoading(true);
    coreProxy
      .getRegistryByName([registryName])
      .map((registryMap) => {
        const registry = registryMap.get(registryName);
        setRegistry(registry);
        setHasEmptyState(!registry?.numberOfEntries);
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const getRegistryEntries = (pageNumber: number) => {
    setLoading(true);
    coreProxy
      .getRegistryEntries(
        registryName,
        pageNumber,
        REGISTRY_ENTRIES_PER_PAGE,
        reversedSortingEnabled
          ? ERegistrySortOrder.REVERSED_ORDER
          : ERegistrySortOrder.DEFAULT,
      )
      .map((registryEntries) => {
        setRegistryEntries(registryEntries);
        setPage(pageNumber);
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const isRegistrar = useMemo(() => {
    return registry?.registrarAddresses.some(
      (address) => address === accountAddress,
    );
  }, [accountAddress, JSON.stringify(registry?.registrarAddresses)]);

  const isRegistrationTokenEnabled = useMemo(() => {
    return (
      registry?.registrationToken != null &&
      !viewUtils.isZeroAddress(registry?.registrationToken)
    );
  }, [JSON.stringify(registry?.registrationToken)]);

  const getHeaderActions: () => IHeaderAction[] = () => {
    const canCreateNewRegistryEntry = isRegistrar || isRegistrationTokenEnabled;

    const canCreateNewBatchRegistryEntry =
      isRegistrar && registry?.modulesCapability.batchMintEnabled;

    const canLazyMintRegistryEntry =
      isRegistrar && registry?.modulesCapability.lazyMintEnabled;

    let headerActions: IHeaderAction[] = [];

    if (canLazyMintRegistryEntry) {
      headerActions.push({
        label: "Lazy Mint Identity",
        onClick: () => {
          setCreateIdentityModalOpen(true);
          setLazyMintModeEnabled(true);
        },
        variant: "contained",
        color: "primary",
      });
    }

    if (canCreateNewBatchRegistryEntry) {
      headerActions.push({
        label: "Create Batch Identity",
        onClick: () => setCreateBatchIdentityModalOpen(true),
        variant: "contained",
        color: "primary",
      });
    }

    if (canCreateNewRegistryEntry) {
      headerActions.push({
        label: "Create New Identity",
        onClick: () => {
          setCreateIdentityModalOpen(true);
          setLazyMintModeEnabled(false);
        },
        variant: "contained",
        color: "primary",
      });
    }

    return headerActions;
  };

  const onSearchClick = (value) => {
    setLoading(true);
    coreProxy
      .getRegistryEntryListByOwnerAddress(
        registryName,
        EthereumAccountAddress(value),
      )
      .map((registryEntries) => {
        setRegistryEntries(registryEntries);
        setPage(1);
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const onRestartClick = () => {
    getRegistryEntries(1);
  };

  const handleIdentityCallback = () => {
    getRegistry();
    setLazyMintModeEnabled(false);
    setCreateIdentityModalOpen(false);
  };

  return (
    <Box>
      <GovernanceWidgetHeader
        label={registryName}
        navigationLink={{
          label: "Registry Entry List",
          onClick: () => {
            onRegistryListNavigate?.();
          },
        }}
        headerActions={getHeaderActions()}
        bottomContent={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Box>
              <GovernanceSearchFilter
                title="Search for owner address"
                placeholder="Search for owner address"
                onSearchClick={onSearchClick}
                onRestartClick={onRestartClick}
              />
            </Box>
            <Box display="flex" alignItems="center">
              <Typography style={{ paddingRight: 5 }}>
                Reverse sorting
              </Typography>
              <GovernanceSwitch
                initialValue={reversedSortingEnabled}
                onChange={(reversedSorting) =>
                  setReversedSortingEnabled(reversedSorting)
                }
              />
            </Box>
          </Box>
        }
      />

      {hasEmptyState && (
        <GovernanceEmptyState
          title="No registiry entries found."
          description="Registiry entries submitted by community members will appear here."
        />
      )}

      {registryEntries.map((registryEntry) => (
        <GovernanceRegistryListItem
          key={registryEntry.label}
          number={
            registryEntry.index != null
              ? (registryEntry.index + 1).toString()
              : "-"
          }
          title=""
          fieldWithValueList={[
            {
              fieldTitle: "Label",
              fieldValue: registryEntry.label || "-",
            },
            {
              fieldTitle: "Token ID",
              fieldValue: registryEntry.tokenId.toString(),
            },
            {
              fieldTitle: "Owner",
              fieldValue: registryEntry.owner || undefined,
            },
            {
              fieldTitle: "Token URI",
              fieldValue: registryEntry.tokenURI || undefined,
            },
          ]}
          {...((isRegistrar || registryEntry.owner === accountAddress) && {
            actionButtonList: [
              {
                label: "View Registry Entry Details",
                onClick: () =>
                  onRegistryEntryDetailsNavigate &&
                  onRegistryEntryDetailsNavigate(
                    registryName,
                    registryEntry.tokenId,
                  ),
              },
            ],
          })}
        />
      ))}
      {!!registry?.numberOfEntries && (
        <GovernancePagination
          customPageOptions={{
            itemsPerPage: REGISTRY_ENTRIES_PER_PAGE,
            totalItems: registry?.numberOfEntries,
            currentPage: page,
          }}
          onChange={(_, page) => {
            setPage(page);
          }}
        />
      )}
      {createIdentityModalOpen && (
        <CreateIdentityWidget
          onCloseCallback={handleIdentityCallback}
          lazyMintModeEnabled={lazyMintModeEnabled}
          registryName={registryName}
          currentAccountAddress={accountAddress}
        />
      )}
      {createBatchIdentityModalOpen && (
        <CreateBatchIdentityWidget
          onCloseCallback={() => {
            getRegistry();
            setCreateBatchIdentityModalOpen(false);
          }}
          registryName={registryName}
          currentAccountAddress={accountAddress}
        />
      )}
    </Box>
  );
};

export default RegistryEntryListWidget;
