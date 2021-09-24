import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceWidgetHeader,
  GovernanceVotingCard,
  GovernanceMarkdown,
  GovernanceStatusTag,
  IHeaderAction,
} from "@web-ui/components";
import { useStyles } from "@web-ui/widgets/ProposalDetailWidget/ProposalDetailWidget.style";
import { IProposalDetailWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import {
  EProposalState,
  Proposal,
  EthereumAddress,
  EVoteSupport,
} from "@hypernetlabs/objects";

const ProposalDetailWidget: React.FC<IProposalDetailWidgetParams> = ({
  onProposalListNavigate,
  proposalId,
}: IProposalDetailWidgetParams) => {
  const classes = useStyles();
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [proposal, setProposal] = useState<Proposal>();

  const [supportStatus, setSupportStatus] = useState<EVoteSupport>();

  useEffect(() => {
    coreProxy.getEthereumAccounts().map((accounts) => {
      console.log("accounts DelegateVotesWidget: ", accounts);

      // delegate votes, createProposal and then list all proposals
      coreProxy
        .getProposalDetails(proposalId)
        .map((proposal) => {
          console.log("proposal: ", proposal);
          setProposal(proposal);
        })
        .mapErr(handleError);

      coreProxy
        .getProposalVotesReceipt(proposalId, accounts[0])
        .map((proposalVoteReceipt) => {
          console.log("proposalVoteReceipt: ", proposalVoteReceipt);
          if (proposalVoteReceipt.hasVoted) {
            setSupportStatus(proposalVoteReceipt.support);
          }
        })
        .mapErr(handleError);
    });
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

  const showVotingButtons = proposal?.state === EProposalState.ACTIVE;

  const queueProposal = () => {
    coreProxy
      .queueProposal(proposalId)
      .map((proposal) => {
        console.log("queueProposal proposal: ", proposal);
        setProposal(proposal);
      })
      .mapErr(handleError);
  };

  const executeProposal = () => {
    coreProxy
      .executeProposal(proposalId)
      .map((proposal) => {
        console.log("executeProposal proposal: ", proposal);
        setProposal(proposal);
      })
      .mapErr(handleError);
  };

  const getHeaderActions: () => IHeaderAction[] | undefined = () => {
    if (
      proposal?.state === EProposalState.SUCCEEDED ||
      proposal?.state === EProposalState.QUEUED
    ) {
      return [
        {
          label:
            proposal?.state === EProposalState.SUCCEEDED
              ? "Queue Proposal"
              : "Exexute Proposal",
          onClick: () => {
            proposal?.state === EProposalState.SUCCEEDED
              ? queueProposal()
              : executeProposal();
          },
          variant: "outlined",
        },
      ];
    } else {
      return undefined;
    }
  };

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
        headerActions={getHeaderActions()}
      />
      {proposal?.state && <GovernanceStatusTag status={proposal?.state} />}
      <Box display="flex">
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <GovernanceVotingCard
              type="for"
              value={Number(proposal?.proposalVotesFor)}
              progressValue={forPercentage}
              onVoteClick={() => {
                console.log("vote");
              }}
              isVoted={supportStatus === EVoteSupport.FOR}
              showVoteButton={showVotingButtons}
              disableVoteButton={supportStatus !== EVoteSupport.FOR}
            />
          </Grid>
          <Grid item xs={4}>
            <GovernanceVotingCard
              type="against"
              value={Number(proposal?.proposalVotesAgaints)}
              progressValue={againstPercentage}
              onVoteClick={() => {
                console.log("vote");
              }}
              isVoted={supportStatus === EVoteSupport.AGAINST}
              showVoteButton={showVotingButtons}
              disableVoteButton={supportStatus !== EVoteSupport.AGAINST}
            />
          </Grid>
          <Grid item xs={4}>
            <GovernanceVotingCard
              type="abstain"
              value={Number(proposal?.proposalETA)}
              progressValue={abstainPercentage}
              onVoteClick={() => {
                console.log("vote");
              }}
              isVoted={supportStatus === EVoteSupport.ABSTAIN}
              showVoteButton={showVotingButtons}
              disableVoteButton={supportStatus !== EVoteSupport.ABSTAIN}
            />
          </Grid>
        </Grid>
      </Box>
      <Box className={classes.proposalDetails}>
        <Typography variant="h5" className={classes.proposalDetailsLabel}>
          Details:
        </Typography>
        <Box className={classes.proposerSectionWrapper}>
          <Typography variant="h5" className={classes.proposerLabel}>
            Proposer
          </Typography>
          <Typography variant="h5" className={classes.proposerValue}>
            {proposal?.proposalOriginator}
          </Typography>
        </Box>
        <GovernanceMarkdown source={proposal?.description} />
      </Box>
    </Box>
  );
};

export default ProposalDetailWidget;
