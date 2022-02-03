import { Box } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import PageWrapper from "@user-dashboard/components/PageWrapper";
import { useLayoutContext, useStoreContext } from "@user-dashboard/contexts";

const ProposalDetail: React.FC = (props) => {
  const history = useHistory();
  const { handleError } = useLayoutContext();
  const { hypernetWebIntegration } = useStoreContext();
  const { proposalId } = useParams<{ proposalId: string }>();

  useEffect(() => {
    hypernetWebIntegration.webUIClient.governance
      .renderProposalDetailWidget({
        selector: "proposal-detail-page-wrapper",
        onProposalListNavigate: () => {
          history.push("/proposals");
        },
        proposalId,
      })
      .mapErr(handleError);
  }, []);

  return (
    <PageWrapper label="Proposal Detail" isGovernance>
      <Box id="proposal-detail-page-wrapper"></Box>
    </PageWrapper>
  );
};

export default ProposalDetail;
