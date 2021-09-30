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
  EProposalVoteSupport,
} from "@hypernetlabs/objects";
import ethers from "ethers";

const ProposalDetailWidget: React.FC<IProposalDetailWidgetParams> = ({
  onProposalListNavigate,
  proposalId,
}: IProposalDetailWidgetParams) => {
  const classes = useStyles();
  const alert = useAlert();
  const { coreProxy, viewUtils } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [proposal, setProposal] = useState<Proposal>();

  const [supportStatus, setSupportStatus] = useState<EProposalVoteSupport>();

  useEffect(() => {
    coreProxy.getEthereumAccounts().map((accounts) => {
      // delegate votes, createProposal and then list all proposals
      coreProxy
        .getProposalDetails(proposalId)
        .map((proposal) => {
          setProposal(proposal);
        })
        .mapErr(handleError);

      coreProxy
        .getProposalVotesReceipt(proposalId, accounts[0])
        .map((proposalVoteReceipt) => {
          if (proposalVoteReceipt.hasVoted) {
            setSupportStatus(Number(proposalVoteReceipt.support));
          }
        })
        .mapErr(handleError);
    });
  }, []);

  const handleError = (err?: Error) => {
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  const proposalVotesFor = proposal
    ? Number(
        viewUtils.fromBigNumberEther(viewUtils.toBigNumber(proposal.votesFor)),
      )
    : 0;

  const proposalVotesAgaints = proposal
    ? Number(
        viewUtils.fromBigNumberEther(
          viewUtils.toBigNumber(proposal ? proposal.votesAgaints : 0),
        ),
      )
    : 0;

  const proposalETA = proposal
    ? Number(
        viewUtils.fromBigNumberEther(
          viewUtils.toBigNumber(proposal.estimatedTimeArrival),
        ),
      )
    : 0;

  const totalVotes = proposalVotesFor + proposalVotesAgaints + proposalETA;

  const forPercentage =
    ((proposalVotesFor * 100) / totalVotes).toFixed(0) || "0";

  const againstPercentage =
    ((proposalVotesAgaints * 100) / totalVotes).toFixed(0) || "0";

  const abstainPercentage =
    ((proposalETA * 100) / totalVotes).toFixed(0) || "0";

  const showVotingButtons = Number(proposal?.state) === EProposalState.ACTIVE;

  const queueProposal = () => {
    coreProxy
      .queueProposal(proposalId)
      .map((proposal) => {
        setProposal(proposal);
      })
      .mapErr(handleError);
  };

  const executeProposal = () => {
    coreProxy
      .executeProposal(proposalId)
      .map((proposal) => {
        setProposal(proposal);
      })
      .mapErr(handleError);
  };

  const castVote = (voteSupport: EProposalVoteSupport) => {
    coreProxy
      .castVote(proposalId, voteSupport)
      .map((proposal) => {
        setProposal(proposal);
      })
      .mapErr(handleError);
  };

  const getHeaderActions: () => IHeaderAction[] | undefined = () => {
    if (
      Number(proposal?.state) === EProposalState.SUCCEEDED ||
      Number(proposal?.state) === EProposalState.QUEUED
    ) {
      return [
        {
          label:
            Number(proposal?.state) === EProposalState.SUCCEEDED
              ? "Queue Proposal"
              : "Execute Proposal",
          onClick: () => {
            Number(proposal?.state) === EProposalState.SUCCEEDED
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
        label={"Proposal Detail"}
        navigationLink={{
          label: "Proposal List",
          onClick: () => {
            onProposalListNavigate?.();
          },
        }}
        headerActions={getHeaderActions()}
      />

      {proposal?.state && (
        <Box className={classes.proposalStatus}>
          <GovernanceStatusTag status={proposal?.state} />
        </Box>
      )}
      <Box display="flex">
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <GovernanceVotingCard
              type="for"
              value={proposalVotesFor}
              progressValue={parseFloat(forPercentage)}
              onVoteClick={() => castVote(EProposalVoteSupport.FOR)}
              isVoted={supportStatus === EProposalVoteSupport.FOR}
              showVoteButton={showVotingButtons}
              disableVoteButton={
                Number(proposal?.state) !== EProposalState.ACTIVE
              }
            />
          </Grid>
          <Grid item xs={4}>
            <GovernanceVotingCard
              type="against"
              value={proposalVotesAgaints}
              progressValue={parseFloat(againstPercentage)}
              onVoteClick={() => castVote(EProposalVoteSupport.FOR)}
              isVoted={supportStatus === EProposalVoteSupport.AGAINST}
              showVoteButton={showVotingButtons}
              disableVoteButton={
                Number(proposal?.state) !== EProposalState.ACTIVE
              }
            />
          </Grid>
          <Grid item xs={4}>
            <GovernanceVotingCard
              type="abstain"
              value={proposalETA}
              progressValue={parseFloat(abstainPercentage)}
              onVoteClick={() => castVote(EProposalVoteSupport.FOR)}
              isVoted={supportStatus === EProposalVoteSupport.ABSTAIN}
              showVoteButton={showVotingButtons}
              disableVoteButton={
                Number(proposal?.state) !== EProposalState.ACTIVE
              }
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
            {proposal?.originator}
          </Typography>
        </Box>
        <GovernanceMarkdown source={proposal?.description} />
      </Box>
    </Box>
  );
};

export default ProposalDetailWidget;
