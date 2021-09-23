import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceEditableValueWithTitle,
  GovernanceValueWithTitle,
  GovernanceWidgetHeader,
} from "@web-ui/components";
import { IRegistryDetailWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { Registry } from "@hypernetlabs/objects";

const RegistryDetailWidget: React.FC<IRegistryDetailWidgetParams> = ({
  onRegistryListNavigate,
  registryId,
}: IRegistryDetailWidgetParams) => {
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [registry, setRegistry] = useState<Registry>();

  useEffect(() => {
    coreProxy
      .getRegistries(10)
      //.getRegistryDetail(registryId)
      .map((registry) => {
        console.log("registry: ", registryId);
        setRegistry(registry[0]);
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
        label="NFT Details"
        navigationLink={{
          label: "Registries",
          onClick: () => {
            onRegistryListNavigate?.();
          },
        }}
      />
      <Box>
        <GovernanceValueWithTitle title="Label " value={registry?.name} />
        <GovernanceValueWithTitle title="Token ID " value="Lorem Ipsum" />
        <GovernanceValueWithTitle
          title="Recipient Address"
          value="Lorem Ipsum"
        />
        <GovernanceEditableValueWithTitle
          title="Recipient Address "
          value="Lorem Ipsum"
          onSave={(newValue) => {
            console.log(newValue);
          }}
        />
      </Box>
    </Box>
  );
};

export default RegistryDetailWidget;
