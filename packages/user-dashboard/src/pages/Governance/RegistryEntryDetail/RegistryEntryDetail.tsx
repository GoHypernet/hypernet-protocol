import { RegistryTokenId } from "@hypernetlabs/objects";
import { Box } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import PageWrapper from "@user-dashboard/components/PageWrapper";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const RegistryEntryDetail: React.FC = () => {
  const history = useHistory();
  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();
  const { registryName, entryTokenId } =
    useParams<{ registryName: string; entryTokenId: string }>();

  useEffect(() => {
    hypernetWebIntegration.webUIClient.registries
      .renderRegistryEntryDetailWidget({
        selector: "registry-entry-detail-page-wrapper",
        onRegistryEntryListNavigate: (registryName: string) => {
          history.push(`/registries/${registryName}/entries`);
        },
        registryName,
        entryTokenId: RegistryTokenId(BigInt(entryTokenId)),
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
