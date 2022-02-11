import { Box } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { RegistryName } from "@hypernetlabs/objects";

import PageWrapper from "@user-dashboard/components/PageWrapper";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const RegistryDetail: React.FC = () => {
  const history = useHistory();
  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();
  const { registryName } = useParams<{ registryName: RegistryName }>();

  useEffect(() => {
    hypernetWebIntegration.webUIClient.registries
      .renderRegistryDetailWidget({
        selector: "registry-detail-page-wrapper",
        onRegistryListNavigate: () => {
          history.push("/registries");
        },
        registryName,
      })
      .mapErr(handleError);
  }, []);

  return (
    <PageWrapper label="Registry Detail" isGovernance>
      <Box id="registry-detail-page-wrapper"></Box>
    </PageWrapper>
  );
};

export default RegistryDetail;
