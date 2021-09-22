import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceRegistryListItem,
  GovernanceWidgetHeader,
} from "@web-ui/components";
import { IRegistryListWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";

const RegistryListWidget: React.FC<IRegistryListWidgetParams> = ({
  onRegistryDetailsNavigate,
}: IRegistryListWidgetParams) => {
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [registries, setRegistries] = useState<string[]>([]);

  useEffect(() => {
    coreProxy
      .getRegistries()
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
      {registries.map((registry) => (
        <GovernanceRegistryListItem
          key={1}
          number="1"
          title={registry}
          tokenURI="Token URI"
          numberOfEntries="numberOfEntries"
          registryAddress="Registry Address"
          onViewDetailsClick={() =>
            onRegistryDetailsNavigate && onRegistryDetailsNavigate("1")
          }
        />
      ))}
    </Box>
  );
};

export default RegistryListWidget;
