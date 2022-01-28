import {
  EthereumAccountAddress,
  Registry,
  ERegistrySortOrder,
} from "@hypernetlabs/objects";
import { Box, Typography } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { IRegistryListWidgetParams } from "@web-ui/interfaces";
import React, { useEffect, useRef, useState } from "react";

import {
  GovernanceRegistryListItem,
  IRegistryListItemAction,
  GovernanceWidgetHeader,
  GovernanceEmptyState,
  GovernancePagination,
  GovernanceSwitch,
} from "@web-ui/components";
import CreateRegistryWidget from "@web-ui/widgets/CreateRegistryWidget";

const REGISTIRES_PER_PAGE = 3;

const RegistryListWidget: React.FC<IRegistryListWidgetParams> = ({
  onRegistryEntryListNavigate,
  onRegistryDetailNavigate,
  onLazyMintRequestsNavigate,
}: IRegistryListWidgetParams) => {
  const { coreProxy } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [hasEmptyState, setHasEmptyState] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [registriesCount, setRegistriesCount] = useState<number>(0);
  const [reversedSortingEnabled, setReversedSortingEnabled] =
    useState<boolean>(false);
  const [accountAddress, setAccountAddress] = useState<EthereumAccountAddress>(
    EthereumAccountAddress(""),
  );
  const [createRegistryModalOpen, setCreateRegistryModalOpen] =
    useState<boolean>(false);
  const mounted = useRef(false);

  useEffect(() => {
    getNumberOfRegistries();

    const subscription = coreProxy.onGovernanceChainChanged.subscribe(
      (chainId) => {
        getNumberOfRegistries();
        handleRegistryListRefresh();
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    coreProxy.getEthereumAccounts().map((accounts) => {
      setAccountAddress(accounts[0]);
    });
  }, []);

  useEffect(() => {
    getRegistries();
  }, [page, registriesCount]);

  useEffect(() => {
    if (mounted.current) {
      handleRegistryListRefresh();
    } else {
      mounted.current = true;
    }
  }, [reversedSortingEnabled]);

  const getNumberOfRegistries = () => {
    setLoading(true);
    coreProxy
      .getNumberOfRegistries()
      .map((numberOfRegistries) => {
        setRegistriesCount(numberOfRegistries);
        if (!numberOfRegistries) {
          setHasEmptyState(true);
        }
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const getRegistries = () => {
    setLoading(true);
    coreProxy
      .getRegistries(
        page,
        REGISTIRES_PER_PAGE,
        reversedSortingEnabled
          ? ERegistrySortOrder.REVERSED_ORDER
          : ERegistrySortOrder.DEFAULT,
      )
      .map((registries) => {
        if (!registries.length) {
          setRegistries([]);
          setHasEmptyState(true);
        } else {
          setRegistries(registries);
          setHasEmptyState(false);
        }
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const handleRegistryListRefresh = () => {
    if (page === 1) {
      getRegistries();
    } else {
      setPage(1);
    }
  };

  const handleCreateRegistryWidgetClose = () => {
    getNumberOfRegistries();
    handleRegistryListRefresh();
    setCreateRegistryModalOpen(false);
  };

  const getRegistryNotAllowedChipItems = (registry: Registry) => {
    const items: string[] = [];

    !registry.allowLabelChange && items.push("Label Change not allowed");
    !registry.allowStorageUpdate && items.push("Storage update not allowed");
    !registry.allowTransfers && items.push("Transfers not allowed");

    return items;
  };

  return (
    <Box>
      <GovernanceWidgetHeader
        label="Registries"
        headerActions={[
          {
            label: "Lazy Minting Requests",
            onClick: () =>
              onLazyMintRequestsNavigate && onLazyMintRequestsNavigate(),
            variant: "outlined",
            color: "primary",
          },
          {
            label: "Create New Registry",
            onClick: () => setCreateRegistryModalOpen(true),
            variant: "contained",
            color: "primary",
          },
        ]}
        rightContent={
          <Box display="flex" alignItems="center" marginTop={3}>
            <Typography style={{ paddingRight: 5 }}>Reverse sorting</Typography>
            <GovernanceSwitch
              initialValue={reversedSortingEnabled}
              onChange={(reversedSorting) =>
                setReversedSortingEnabled(reversedSorting)
              }
            />
          </Box>
        }
      />

      {hasEmptyState && (
        <GovernanceEmptyState
          title="No registiries found."
          description="Registiries submitted by community members will appear here."
        />
      )}

      {registries.map((registry, index) => (
        <GovernanceRegistryListItem
          key={registry.name}
          number={
            registry.index != null ? (registry.index + 1).toString() : "-"
          }
          title={registry.name}
          fieldWithValueList={[
            {
              fieldTitle: "Symbol",
              fieldValue: registry.symbol,
            },
            {
              fieldTitle: "Address",
              fieldValue: registry.address,
            },
            {
              fieldTitle: "Number of Entries",
              fieldValue: registry.numberOfEntries.toString(),
            },
            {
              fieldTitle: "Registrar Addresses",
              fieldValue: registry.registrarAddresses.join(" "),
            },
          ]}
          actionButtonList={
            [
              {
                label: "Detail",
                variant: "text",
                onClick: () =>
                  onRegistryDetailNavigate &&
                  onRegistryDetailNavigate(registry.name),
              },
              {
                label: "View Registry Entries",
                onClick: () =>
                  onRegistryEntryListNavigate &&
                  onRegistryEntryListNavigate(registry.name),
              },
            ] as IRegistryListItemAction[]
          }
          chipItemList={getRegistryNotAllowedChipItems(registry)}
        />
      ))}
      {!!registriesCount && (
        <GovernancePagination
          customPageOptions={{
            itemsPerPage: REGISTIRES_PER_PAGE,
            totalItems: registriesCount,
            currentPage: page,
          }}
          onChange={(_, page) => {
            setPage(page);
          }}
        />
      )}

      {createRegistryModalOpen && (
        <CreateRegistryWidget
          onCloseCallback={handleCreateRegistryWidgetClose}
          currentAccountAddress={accountAddress}
        />
      )}
    </Box>
  );
};

export default RegistryListWidget;
