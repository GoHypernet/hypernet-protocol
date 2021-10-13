import React, { useEffect, useState, useMemo } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceRegistryListItem,
  GovernanceWidgetHeader,
  GovernancePagination,
  getPageItemIndexList,
  GovernanceEmptyState,
} from "@web-ui/components";
import { IRegistryEntryListWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import {
  EthereumAddress,
  Registry,
  RegistryEntry,
} from "@hypernetlabs/objects";
import CreateIdentityWidget from "../CreateIdentityWidget";

const REGISTRY_ENTRIES_PER_PAGE = 3;

const RegistryEntryListWidget: React.FC<IRegistryEntryListWidgetParams> = ({
  onRegistryEntryDetailsNavigate,
  onRegistryListNavigate,
  registryName,
}: IRegistryEntryListWidgetParams) => {
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [registryEntries, setRegistryEntries] = useState<RegistryEntry[]>([]);
  const [registry, setRegistry] = useState<Registry>();
  const [accountAddress, setAccountAddress] = useState<EthereumAddress>(
    EthereumAddress(""),
  );

  const [createIdentityModalOpen, setCreateIdentityModalOpen] =
    useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [registryEntriesCount, setRegistryEntriesCount] = useState<number>(0);
  const [hasEmptyState, setHasEmptyState] = useState<boolean>(false);

  const registryEntriesNumberArr = useMemo(
    () =>
      getPageItemIndexList(
        registryEntriesCount,
        page,
        REGISTRY_ENTRIES_PER_PAGE,
      ),
    [registryEntriesCount, page],
  );

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
    coreProxy.getEthereumAccounts().map((accounts) => {
      setAccountAddress(accounts[0]);
    });
  }, []);

  useEffect(() => {
    coreProxy
      .getRegistryEntriesTotalCount([registryName])
      .map((countsMap) => {
        const count = countsMap.get(registryName);
        setRegistryEntriesCount(count || 0);
        if (!count) {
          setHasEmptyState(true);
        }
      })
      .mapErr(handleError);
  }, []);

  useEffect(() => {
    if (registryEntriesNumberArr.length) {
      coreProxy
        .getRegistryEntries(registryName, registryEntriesNumberArr)
        .map((registryEntries) => {
          setRegistryEntries(registryEntries);
        })
        .mapErr(handleError);
    }
  }, [JSON.stringify(registryEntriesNumberArr)]);

  const handleError = (err?: Error) => {
    console.log("handleError err: ", err);
    setLoading(false);
    setHasEmptyState(true);
    alert.error(err?.message || "Something went wrong!");
  };

  return (
    <Box>
      <GovernanceWidgetHeader
        label="Registry Entries"
        navigationLink={{
          label: "Registry Entry List",
          onClick: () => {
            onRegistryListNavigate?.();
          },
        }}
        {...(registry?.registrarAddresses.some(
          (address) => address === accountAddress,
        ) && {
          headerActions: [
            {
              label: "Create New Identity",
              onClick: () => setCreateIdentityModalOpen(true),
              variant: "contained",
              color: "primary",
            },
          ],
        })}
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
          number={registryEntry.tokenId.toString()}
          title={registryEntry.label}
          fieldWithValueList={[
            {
              fieldTitle: "Token ID",
              fieldValue: registryEntry.tokenId.toString(),
              fullWidth: true,
            },
            {
              fieldTitle: "Owner",
              fieldValue: registryEntry.owner || undefined,
              fullWidth: true,
            },
            {
              fieldTitle: "Token URI",
              fieldValue: registryEntry.tokenURI || undefined,
              fullWidth: true,
            },
          ]}
          actionButtonList={[
            {
              label: "View Registry Entry Details",
              onClick: () =>
                onRegistryEntryDetailsNavigate &&
                onRegistryEntryDetailsNavigate(
                  registryName,
                  registryEntry.label,
                ),
            },
          ]}
        />
      ))}
      {registryEntriesCount > 0 && (
        <GovernancePagination
          customPageOptions={{
            itemsPerPage: REGISTRY_ENTRIES_PER_PAGE,
            totalItems: registryEntriesCount,
          }}
          onChange={(_, page) => {
            setPage(page);
          }}
        />
      )}
      {createIdentityModalOpen && (
        <CreateIdentityWidget
          onCloseCallback={() => setCreateIdentityModalOpen(false)}
          registryName={registryName}
        />
      )}
    </Box>
  );
};

export default RegistryEntryListWidget;
