import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceRegistryListItem,
  GovernanceWidgetHeader,
  GovernancePagination,
  GovernanceEmptyState,
  GovernanceSwitch,
} from "@web-ui/components";
import { IRegistryEntryListWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import {
  EthereumAddress,
  Registry,
  RegistryEntry,
} from "@hypernetlabs/objects";
import CreateIdentityWidget from "@web-ui/widgets/CreateIdentityWidget";

const REGISTRY_ENTRIES_PER_PAGE = 3;

const RegistryEntryListWidget: React.FC<IRegistryEntryListWidgetParams> = ({
  onRegistryEntryDetailsNavigate,
  onRegistryListNavigate,
  registryName,
}: IRegistryEntryListWidgetParams) => {
  const alert = useAlert();
  const { coreProxy, viewUtils } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [registryEntries, setRegistryEntries] = useState<RegistryEntry[]>([]);
  const [registry, setRegistry] = useState<Registry>();
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>(
    EthereumAddress(""),
  );
  const [reversedSortingEnabled, setReversedSortingEnabled] =
    useState<boolean>(false);

  const [createIdentityModalOpen, setCreateIdentityModalOpen] =
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
    coreProxy
      .getRegistryByName([registryName])
      .map((registryMap) => {
        const registry = registryMap.get(registryName);
        setRegistry(registry);
        setHasEmptyState(!registry?.numberOfEntries);
        setLoading(false);
      })
      .mapErr(handleError);
  };

  const getRegistryEntries = (pageNumber: number) => {
    coreProxy
      .getRegistryEntries(
        registryName,
        pageNumber,
        REGISTRY_ENTRIES_PER_PAGE,
        reversedSortingEnabled,
      )
      .map((registryEntries) => {
        setRegistryEntries(registryEntries);
        setPage(pageNumber);
      })
      .mapErr(handleError);
  };

  const handleError = (err?: Error) => {
    setLoading(false);
    setHasEmptyState(true);
    alert.error(err?.message || "Something went wrong!");
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

  const canCreateNewRegistryEntry = isRegistrar || isRegistrationTokenEnabled;

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
        {...(canCreateNewRegistryEntry && {
          headerActions: [
            {
              label: "Create New Identity",
              onClick: () => setCreateIdentityModalOpen(true),
              variant: "contained",
              color: "primary",
            },
          ],
        })}
        rightContent={
          <Box display="flex" alignItems="center" marginTop={5}>
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
          }}
          onChange={(_, page) => {
            setPage(page);
          }}
        />
      )}
      {createIdentityModalOpen && (
        <CreateIdentityWidget
          onCloseCallback={() => {
            getRegistry();
            setCreateIdentityModalOpen(false);
          }}
          registryName={registryName}
          currentAccountAddress={accountAddress}
        />
      )}
    </Box>
  );
};

export default RegistryEntryListWidget;
