import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceRegistryListItem,
  GovernanceWidgetHeader,
} from "@web-ui/components";
import { IRegistryListWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { Registry } from "@hypernetlabs/objects";

const RegistryListWidget: React.FC<IRegistryListWidgetParams> = ({
  onRegistryEntryListNavigate,
}: IRegistryListWidgetParams) => {
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [registries, setRegistries] = useState<Registry[]>([]);

  useEffect(() => {
    coreProxy
      .getRegistries(10)
      .map((registries) => {
        console.log("registry list: ", registries);
        setRegistries(registries);
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
      <GovernanceWidgetHeader label="Registries" />
      {registries.map((registry, index) => (
        <GovernanceRegistryListItem
          key={registry.name}
          number="1"
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
          ]}
          buttonLabel="View Registry Entries"
          onViewDetailsClick={() =>
            onRegistryEntryListNavigate && onRegistryEntryListNavigate("1")
          }
        />
      ))}
    </Box>
  );
};

export default RegistryListWidget;
