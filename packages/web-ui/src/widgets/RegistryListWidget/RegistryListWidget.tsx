import {
  EthereumAccountAddress,
  Registry,
  ERegistrySortOrder,
} from "@hypernetlabs/objects";
import { Box, Typography } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { IRegistryListWidgetParams } from "@web-ui/interfaces";
import React, { useEffect, useState } from "react";

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

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    coreProxy.getEthereumAccounts().map((accounts) => {
      setAccountAddress(accounts[0]);
    });
  }, []);

  useEffect(() => {
    getRegistries(page);
  }, [page, registriesCount]);

  useEffect(() => {
    getRegistries(1);
  }, [reversedSortingEnabled]);

  const getRegistries = (pageNumber: number) => {
    setLoading(true);
    coreProxy
      .getRegistries(
        pageNumber,
        REGISTIRES_PER_PAGE,
        reversedSortingEnabled
          ? ERegistrySortOrder.REVERSED_ORDER
          : ERegistrySortOrder.DEFAULT,
      )
      .map((registries) => {
        setPage(pageNumber);
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
              fieldTitle: "First Registrar Addresses",
              fieldValue: registry.registrarAddresses.join("-"),
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
          onCloseCallback={() => {
            setReversedSortingEnabled(true);
            getRegistries(1);
            setCreateRegistryModalOpen(false);
          }}
          currentAccountAddress={accountAddress}
        />
      )}
    </Box>
  );
};

export default RegistryListWidget;
