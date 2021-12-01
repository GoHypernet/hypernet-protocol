import {
  EProposalState,
  Proposal,
  EthereumAccountAddress,
  EProposalVoteSupport,
} from "@hypernetlabs/objects";
import { Box, Typography, Grid } from "@material-ui/core";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { IProposalDetailWidgetParams } from "@web-ui/interfaces";
import React, { useEffect, useState, useMemo } from "react";

import {
  GovernanceWidgetHeader,
  GovernanceVotingCard,
  GovernanceMarkdown,
  GovernanceStatusTag,
  GovernanceButton,
} from "@web-ui/components";
import { useStyles } from "@web-ui/widgets/ProposalDetailWidget/ProposalDetailWidget.style";

const ProposalDetailWidget: React.FC<IProposalDetailWidgetParams> = ({
  onProposalListNavigate,
  proposalId,
}: IProposalDetailWidgetParams) => {
  const classes = useStyles();
  const { coreProxy } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();
  const [proposal, setProposal] = useState<Proposal>();
  const [accountAddress, setAccountAddress] =
    useState<EthereumAccountAddress>();
  const [supportStatus, setSupportStatus] = useState<EProposalVoteSupport>();

  useEffect(() => {
    getProposalDetail();
  }, []);

  const getProposalDetail = () => {
    setLoading(true);
    coreProxy.getEthereumAccounts().map((accounts) => {
      setAccountAddress(accounts[0]);

      // delegate votes, createProposal and then list all proposals
      coreProxy
        .getProposalDetails(proposalId)
        .map((proposal) => {
          setProposal(proposal);
        })
        .mapErr(handleCoreError);

      getProposalVotesReceipt(accounts[0]);
    });
  };

  const getProposalVotesReceipt = (account: EthereumAccountAddress) => {
    setLoading(true);

    coreProxy
      .getProposalVotesReceipt(proposalId, account)
      .map((proposalVoteReceipt) => {
        if (proposalVoteReceipt.hasVoted) {
          setSupportStatus(Number(proposalVoteReceipt.support));
        }

        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const proposalVotesFor = proposal ? proposal.votesFor : 0;

  const proposalVotesAgainst = proposal ? proposal.votesAgainst : 0;

  const proposalVotesAbstain = proposal ? proposal.votesAbstain : 0;

  const totalVotes =
    proposalVotesFor + proposalVotesAgainst + proposalVotesAbstain;

  const forPercentage =
    ((proposalVotesFor * 100) / totalVotes).toFixed(0) || "0";

  const againstPercentage =
    ((proposalVotesAgainst * 100) / totalVotes).toFixed(0) || "0";

  const abstainPercentage =
    ((proposalVotesAbstain * 100) / totalVotes).toFixed(0) || "0";

  const showVotingButtons = Number(proposal?.state) === EProposalState.ACTIVE;

  const queueProposal = () => {
    setLoading(true);
    coreProxy
      .queueProposal(proposalId)
      .map((proposal) => {
        setProposal(proposal);
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const cancelProposal = () => {
    setLoading(true);
    coreProxy
      .cancelProposal(proposalId)
      .map((proposal) => {
        setProposal(proposal);
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const executeProposal = () => {
    setLoading(true);
    coreProxy
      .executeProposal(proposalId)
      .map((proposal) => {
        setProposal(proposal);
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const castVote = (voteSupport: EProposalVoteSupport) => {
    setLoading(true);
    coreProxy
      .castVote(proposalId, voteSupport)
      .map((proposal) => {
        setProposal(proposal);

        if (accountAddress) {
          getProposalVotesReceipt(accountAddress);
        }
      })
      .mapErr(handleCoreError);
  };

  const isUserProposalOwner = useMemo(
    () =>
      proposal &&
      accountAddress &&
      EthereumAccountAddress(proposal.originator) === accountAddress,
    [JSON.stringify(proposal), accountAddress],
  );

  const canQueueProposal = useMemo(() => {
    return Number(proposal?.state) === EProposalState.SUCCEEDED;
  }, [JSON.stringify(proposal)]);

  const canExecuteProposal = useMemo(() => {
    return Number(proposal?.state) === EProposalState.QUEUED;
  }, [JSON.stringify(proposal)]);

  const canCancelProposal = useMemo(() => {
    return (
      isUserProposalOwner &&
      [
        EProposalState.PENDING,
        EProposalState.QUEUED,
        EProposalState.ACTIVE,
        EProposalState.SUCCEEDED,
        EProposalState.DEFEATED,
        EProposalState.EXPIRED,
      ].includes(Number(proposal?.state))
    );
  }, [JSON.stringify(proposal), isUserProposalOwner]);

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
        rightContent={
          <Box display="flex" flexDirection="row">
            {canCancelProposal && (
              <Box marginLeft="10px">
                <GovernanceButton
                  onClick={() => {
                    cancelProposal();
                  }}
                  variant="outlined"
                >
                  Cancel Proposal
                </GovernanceButton>
              </Box>
            )}
            {canQueueProposal && (
              <Box marginLeft="10px">
                <GovernanceButton
                  color="primary"
                  size="medium"
                  onClick={() => {
                    queueProposal();
                  }}
                  variant="outlined"
                >
                  Queue Proposal
                </GovernanceButton>
              </Box>
            )}
            {canExecuteProposal && (
              <Box marginLeft="10px">
                <GovernanceButton
                  onClick={() => {
                    executeProposal();
                  }}
                  variant="outlined"
                >
                  Execute Proposal
                </GovernanceButton>
              </Box>
            )}
          </Box>
        }
      />

      {proposal?.state != null && (
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
              value={proposalVotesAgainst}
              progressValue={parseFloat(againstPercentage)}
              onVoteClick={() => castVote(EProposalVoteSupport.AGAINST)}
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
              value={proposalVotesAbstain}
              progressValue={parseFloat(abstainPercentage)}
              onVoteClick={() => castVote(EProposalVoteSupport.ABSTAIN)}
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
