import { Box } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import PageWrapper from "@user-dashboard/components/PageWrapper";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";
import { ROUTES } from "@user-dashboard/containers/Router/Router.routes";

const Proposals: React.FC = () => {
  const history = useHistory();
  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();

  useEffect(() => {
    hypernetWebIntegration.webUIClient.governance
      .renderProposalsWidget({
        selector: "proposals-page-wrapper",
        onProposalCreationNavigate: () => {
          history.push(ROUTES.PROPOSAL_CREATE);
        },
        onProposalDetailsNavigate: (proposalId: string) => {
          history.push(`/proposals/${proposalId}`);
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
