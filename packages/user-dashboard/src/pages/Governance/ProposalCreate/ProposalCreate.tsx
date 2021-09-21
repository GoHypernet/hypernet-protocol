import { Box } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import PageWrapper from "@user-dashboard/components/PageWrapper";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const ProposalCreate: React.FC = () => {
  const history = useHistory();
  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();

  useEffect(() => {
    hypernetWebIntegration.webUIClient
      .renderProposalCreateWidget({
        selector: "proposal-create-page-wrapper",
        onProposalListNavigate: () => {
          history.push("/proposals");
          console.log("onProposalCreationNavigate");
        },
      })
      .mapErr(handleError);
  }, []);

  return (
    <PageWrapper label="Proposals" isGovernance>
      <Box id="proposal-create-page-wrapper"></Box>
    </PageWrapper>
  );
};

export default ProposalCreate;
