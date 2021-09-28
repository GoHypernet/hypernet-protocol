import { Box } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import PageWrapper from "@user-dashboard/components/PageWrapper";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const Proposals: React.FC = () => {
  const history = useHistory();
  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();

  useEffect(() => {
    hypernetWebIntegration.webUIClient
      .renderProposalsWidget({
        selector: "proposals-page-wrapper",
        onProposalCreationNavigate: () => {
          history.push("/proposal-create");
          console.log("onProposalCreationNavigate");
        },
        onProposalDetailsNavigate: (proposalId: string) => {
          console.log('proposalId: ', proposalId);
          history.push(`/proposals/${proposalId}`);
          console.log("onProposalDetailsNavigate");
        },
      })
      .mapErr(handleError);
  }, []);

  return (
    <PageWrapper label="Proposals" isGovernance>
      <Box id="proposals-page-wrapper"></Box>
    </PageWrapper>
  );
};

export default Proposals;