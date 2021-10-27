import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceRegistryListItem,
  IRegistryListItemAction,
  GovernanceWidgetHeader,
  GovernanceEmptyState,
  getPageItemIndexList,
  GovernancePagination,
  GovernanceSwitch,
} from "@web-ui/components";
import { IRegistryListWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import {
  EthereumAddress,
  Registry,
  RegistryParams,
} from "@hypernetlabs/objects";

const REGISTIRES_PER_PAGE = 3;

const RegistryListWidget: React.FC<IRegistryListWidgetParams> = ({
  onRegistryEntryListNavigate,
  onRegistryDetailNavigate,
}: IRegistryListWidgetParams) => {
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { loading, setLoading } = useLayoutContext();
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [hasEmptyState, setHasEmptyState] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [registriesCount, setRegistriesCount] = useState<number>(0);
  const [reversedSortingEnabled, setReversedSortingEnabled] =
    useState<boolean>(false);
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>(
    EthereumAddress(""),
  );

  useEffect(() => {
    coreProxy
      .getNumberOfRegistries()
      .map((numberOfRegistries) => {
        console.log("numberOfRegistries: ", numberOfRegistries);
        setRegistriesCount(numberOfRegistries);
        if (!numberOfRegistries) {
          setHasEmptyState(true);
        }
      })
      .mapErr(handleError);
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
    coreProxy
      .getRegistries(pageNumber, REGISTIRES_PER_PAGE, reversedSortingEnabled)
      .map((registries) => {
        setRegistries(registries);
        setPage(pageNumber);
        if (!registries.length) {
          setHasEmptyState(true);
        }
      })
      .mapErr(handleError);
  };

  const handleError = (err?: Error) => {
    setLoading(false);
    setHasEmptyState(true);
    alert.error(err?.message || "Something went wrong!");
  };

  const getRegistryNotAllowedChipItems = (registry: Registry) => {
    const items: string[] = [];

    !registry.allowLazyRegister && items.push("Lazy Registration not allowed");
    !registry.allowLabelChange && items.push("Label Change not allowed");
    !registry.allowStorageUpdate && items.push("Storage update not allowed");
    !registry.allowTransfers && items.push("Transfers not allowed");

    return items;
  };

  const getIsRegistrar = (registry: Registry) =>
    registry.registrarAddresses.some((address) => address === accountAddress);

  return (
    <Box>
      <GovernanceWidgetHeader
        label="Registries"
        rightContent={
          <Box display="flex" alignItems="center">
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
              fieldValue: registry.registrarAddresses.join("-"),
            },
          ]}
          actionButtonList={
            [
              ...(getIsRegistrar(registry)
                ? [
                    {
                      label: "Detail",
                      variant: "text",
                      onClick: () =>
                        onRegistryDetailNavigate &&
                        onRegistryDetailNavigate(registry.name),
                    },
                  ]
                : []),
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
    </Box>
  );
};

export default RegistryListWidget;
