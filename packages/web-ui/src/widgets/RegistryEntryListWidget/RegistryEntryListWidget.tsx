import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceRegistryListItem,
  GovernanceWidgetHeader,
} from "@web-ui/components";
import { IRegistryEntryListWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { RegistryEntry } from "@hypernetlabs/objects";

const RegistryEntryListWidget: React.FC<IRegistryEntryListWidgetParams> = ({
  onRegistryEntryDetailsNavigate,
  onRegistryListNavigate,
  registryName,
}: IRegistryEntryListWidgetParams) => {
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [registryEntries, setRegistryEntries] = useState<RegistryEntry[]>([]);

  useEffect(() => {
    coreProxy
      .getRegistryEntries(registryName)
      .map((registryEntries) => {
        console.log("registry entry list: ", registryEntries);
      })
      .mapErr(handleError);

    coreProxy
      .getRegistryEntries(registryName, [1, 2, 3, 4, 5, 6, 7])
      .map((registryEntries) => {
        console.log("registry entry list wth filter: ", registryEntries);
        setRegistryEntries(registryEntries);
      })
      .mapErr(handleError);

    coreProxy
      .getRegistryEntriesTotalCount(registryName)
      .map((count) => {
        console.log("registry entry list count: ", count);
      })
      .mapErr(handleError);
  }, []);

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
    </Box>
  );
};

export default RegistryEntryListWidget;
