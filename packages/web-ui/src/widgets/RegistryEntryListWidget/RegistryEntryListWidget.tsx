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
        setRegistryEntries(registryEntries);
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
        label="Registries"
        navigationLink={{
          label: "Registry List",
          onClick: () => {
            onRegistryListNavigate?.();
          },
        }}
      />
      {registryEntries.map((registryEntry) => (
        <GovernanceRegistryListItem
          key={registryEntry.label}
          number="1"
          title={registryEntry.label}
          fieldWithValueList={[
            {
              fieldTitle: "Token ID",
              fieldValue: registryEntry.tokenId.toString(),
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
