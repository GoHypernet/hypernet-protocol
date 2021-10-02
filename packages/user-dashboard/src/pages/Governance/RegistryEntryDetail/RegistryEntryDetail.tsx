import { Box } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import PageWrapper from "@user-dashboard/components/PageWrapper";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const RegistryEntryDetail: React.FC = () => {
  const history = useHistory();
  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();
  const { registryName, entryLabel } =
    useParams<{ registryName: string; entryLabel: string }>();

  useEffect(() => {
    hypernetWebIntegration.webUIClient
      .renderRegistryEntryDetailWidget({
        selector: "registry-entry-detail-page-wrapper",
        onRegistryEntryListNavigate: (registryName: string) => {
          history.push(`/registries/${registryName}/entries`);
        },
        registryName,
        entryLabel: decodeURIComponent(entryLabel),
      })
      .mapErr(handleError);
  }, []);

  return (
    <PageWrapper label="Registry Entries" isGovernance>
      <Box id="registry-entry-detail-page-wrapper"></Box>
    </PageWrapper>
  );
};

export default RegistryEntryDetail;
