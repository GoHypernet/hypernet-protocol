import React, { useEffect, useState, useMemo } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceRegistryListItem,
  GovernanceWidgetHeader,
  GovernanceEmptyState,
  getPageItemIndexList,
  GovernancePagination,
} from "@web-ui/components";
import { IRegistryListWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import {
  EthereumAddress,
  Registry,
  RegistryParams,
} from "@hypernetlabs/objects";

const REGISTIRES_PER_PAGE = 2;

const RegistryListWidget: React.FC<IRegistryListWidgetParams> = ({
  onRegistryEntryListNavigate,
}: IRegistryListWidgetParams) => {
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { loading, setLoading } = useLayoutContext();
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [hasEmptyState, setHasEmptyState] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [registriesCount, setRegistriesCount] = useState<number>(0);

  /* const registriesNumberArr = useMemo(
    () => getPageItemIndexList(registriesCount, page, REGISTIRES_PER_PAGE),
    [registriesCount, page],
  ); */

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
    coreProxy
      .getRegistries(page, REGISTIRES_PER_PAGE)
      .map((registries) => {
        setRegistries(registries);
        if (!registries.length) {
          setHasEmptyState(true);
        }
      })
      .mapErr(handleError);
  }, [page, registriesCount]);

  const handleError = (err?: Error) => {
    setLoading(false);
    setHasEmptyState(true);
    alert.error(err?.message || "Something went wrong!");
  };

  return (
    <Box>
      <GovernanceWidgetHeader label="Registries" />

      {hasEmptyState && (
        <GovernanceEmptyState
          title="No registiries found."
          description="Registiries submitted by community members will appear here."
        />
      )}

      {registries.map((registry, index) => (
        <GovernanceRegistryListItem
          key={registry.name}
          number={(registries.length - index).toString()}
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
              fieldTitle: "Registrar Addresses",
              fieldValue: registry.registrarAddresses.join("-"),
            },
            {
              fieldTitle: "Number of Entries",
              fieldValue: registry.numberOfEntries.toString(),
            },
          ]}
          buttonLabel="View Registry Entries"
          onViewDetailsClick={() =>
            onRegistryEntryListNavigate &&
            onRegistryEntryListNavigate(registry.name)
          }
        />
      ))}
      {!!registriesCount && (
        <GovernancePagination
          customPageOptions={{
            itemsPerPage: REGISTIRES_PER_PAGE,
            totalItems: registriesCount,
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
