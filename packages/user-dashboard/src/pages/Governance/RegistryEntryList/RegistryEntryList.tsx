import { RegistryTokenId } from "@hypernetlabs/objects";
import { Box } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import PageWrapper from "@user-dashboard/components/PageWrapper";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const RegistryEntryList: React.FC = () => {
  const history = useHistory();
  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();
  const { registryName } = useParams<{ registryName: string }>();

  useEffect(() => {
    hypernetWebIntegration.webUIClient.registries
      .renderRegistryEntryListWidget({
        selector: "registry-entry-list-page-wrapper",
        onRegistryEntryDetailsNavigate: (
          registryName: string,
          entryTokenId: RegistryTokenId,
        ) => {
          history.push(`/registries/${registryName}/entries/${entryTokenId}`);
        },
        onRegistryListNavigate: () => {
          history.push("/registries/");
        },
        registryName,
      })
      .mapErr(handleError);
  }, []);

  return (
    <PageWrapper label="Registry Entries" isGovernance>
      <Box id="registry-entry-list-page-wrapper"></Box>
    </PageWrapper>
  );
};

export default RegistryEntryList;
