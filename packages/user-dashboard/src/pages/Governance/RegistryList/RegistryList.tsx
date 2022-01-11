import { Box } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import PageWrapper from "@user-dashboard/components/PageWrapper";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const RegistryList: React.FC = () => {
  const history = useHistory();
  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();

  useEffect(() => {
    hypernetWebIntegration.webUIClient
      .renderRegistryListWidget({
        selector: "registry-list-page-wrapper",
        onRegistryEntryListNavigate: (registryName: string) => {
          history.push(`/registries/${registryName}/entries`);
        },
        onRegistryDetailNavigate: (registryName: string) => {
          history.push(`/registries/${registryName}`);
        },
        onLazyMintRequestsNavigate: () => {
          history.push(`/registries/lazy-minting-requests`);
        },
      })
      .mapErr(handleError);
  }, []);

  return (
    <PageWrapper label="Registries" isGovernance>
      <Box id="registry-list-page-wrapper"></Box>
    </PageWrapper>
  );
};

export default RegistryList;
