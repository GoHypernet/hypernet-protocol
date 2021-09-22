import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceWidgetHeader,
  GovernanceVotingCard,
} from "@web-ui/components";
import { IProposalDetailWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { EProposalState, Proposal } from "@hypernetlabs/objects";

const ProposalDetailWidget: React.FC<IProposalDetailWidgetParams> = ({
  onProposalListNavigate,
  proposalId,
}: IProposalDetailWidgetParams) => {
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [proposal, setProposal] = useState<Proposal>();

  useEffect(() => {
    coreProxy.getEthereumAccounts().map((accounts) => {
      console.log("accounts: ", accounts);
    });
    // delegate votes, createProposal and then list all proposals
    coreProxy
      .getProposalDetails(proposalId)
      .map((proposal) => {
        console.log("proposal: ", proposal);
        setProposal(proposal);
      })
      .mapErr(handleError);
  }, []);

  const handleError = (err?: Error) => {
    console.log("handleError err: ", err);
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  const totalVotes: number | undefined = proposal
    ? Number(proposal.proposalVotesFor) +
      Number(proposal.proposalVotesAgaints) +
      Number(proposal.proposalETA)
    : undefined;

  const forPercentage: number =
    proposal && totalVotes
      ? parseFloat(
          ((Number(proposal.proposalVotesFor) * 100) / totalVotes).toFixed(0),
        )
      : 0;

  const againstPercentage: number =
    proposal && totalVotes
      ? parseFloat(
          ((Number(proposal.proposalVotesAgaints) * 100) / totalVotes).toFixed(
            0,
          ),
        )
      : 0;

  const abstainPercentage: number =
    proposal && totalVotes
      ? parseFloat(
          ((Number(proposal.proposalETA) * 100) / totalVotes).toFixed(0),
        )
      : 0;

  const availableVotes = 1;
  const showVotingButtons = !!(
    availableVotes &&
    proposal &&
    proposal.state === EProposalState.ACTIVE
  );

  return (
    <Box>
      <GovernanceWidgetHeader
        label="Proposals"
        navigationLink={{
          label: "Proposal List",
          onClick: () => {
            onProposalListNavigate?.();
          },
        }}
      />
      <Box>
        <GovernanceVotingCard
          type="for"
          value={Number(proposal?.proposalVotesFor)}
          progressValue={forPercentage}
          onVoteClick={() => {
            console.log("vote");
          }}
          isVoted={false}
          showVoteButton={showVotingButtons}
          disableVoteButton={false}
        />
        <GovernanceVotingCard
          type="against"
          value={Number(proposal?.proposalVotesAgaints)}
          progressValue={againstPercentage}
          onVoteClick={() => {
            console.log("vote");
          }}
          isVoted={false}
          showVoteButton={showVotingButtons}
          disableVoteButton={false}
        />
        <GovernanceVotingCard
          type="abstain"
          value={Number(proposal?.proposalETA)}
          progressValue={abstainPercentage}
          onVoteClick={() => {
            console.log("vote");
          }}
          isVoted={false}
          showVoteButton={showVotingButtons}
          disableVoteButton={false}
        />
      </Box>
    </Box>
  );
};

export default ProposalDetailWidget;
