import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceRegistryListItem,
  GovernanceWidgetHeader,
  GovernanceEmptyState,
} from "@web-ui/components";
import { IRegistryListWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { Registry } from "@hypernetlabs/objects";

const RegistryListWidget: React.FC<IRegistryListWidgetParams> = ({
  onRegistryEntryListNavigate,
}: IRegistryListWidgetParams) => {
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { loading, setLoading } = useLayoutContext();
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [hasEmptyState, setHasEmptyState] = useState<boolean>(false);

  useEffect(() => {
    coreProxy
      .getRegistries(1, 10)
      .map((registries) => {
        setRegistries(registries);
        if (!registries.length) {
          setHasEmptyState(true);
        }
      })
      .mapErr(handleError);
  }, []);

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
          actionButtonList={[
            {
              label: "Detail",
              variant: "text",
              onClick: () =>
                onRegistryEntryListNavigate &&
                onRegistryEntryListNavigate(registry.name),
            },
            {
              label: "View Registry Entries",
              onClick: () =>
                onRegistryEntryListNavigate &&
                onRegistryEntryListNavigate(registry.name),
            },
          ]}
          chipItemList={[
            "Lazy Registration not allowed",
            "Lazy Registration not allowed",
            "Lazy Registration not allowed",
            "Lazy Registration not allowed",
          ]}
        />
      ))}
    </Box>
  );
};

export default RegistryListWidget;
