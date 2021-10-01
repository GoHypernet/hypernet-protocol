import React, { useEffect, useState, useMemo } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceRegistryListItem,
  GovernanceWidgetHeader,
  GovernancePagination,
  getPageItemIndexList,
} from "@web-ui/components";
import { IRegistryEntryListWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { RegistryEntry } from "@hypernetlabs/objects";

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

  const [page, setPage] = useState<number>(1);
  const [registryEntriesCount, setRegistryEntriesCount] = useState<number>(0);

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
      .getRegistryEntriesTotalCount([registryName])
      .map((countsMap) => {
        const count = countsMap.get(registryName);
        setRegistryEntriesCount(count || 0);
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
      />
      {registryEntries.map((registryEntry) => (
        <GovernanceRegistryListItem
          key={registryEntry.label}
          number={registryEntry.tokenId.toString()}
          title={registryEntry.label}
          fieldWithValueList={[
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
          buttonLabel="View Registry Entry Details"
          onViewDetailsClick={() =>
            onRegistryEntryDetailsNavigate &&
            onRegistryEntryDetailsNavigate(registryName, registryEntry.label)
          }
        />
      ))}
      {!!registryEntriesCount && (
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
    </Box>
  );
};

export default RegistryEntryListWidget;
