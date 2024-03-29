import {
  EProposalState,
  Proposal,
  EthereumAccountAddress,
  EProposalVoteSupport,
  IpfsCID,
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
import { hasProposalDescriptionHash } from "@web-ui/widgets/ProposalsWidget/ProposalsWidget";
import { useStyles } from "@web-ui/widgets/ProposalDetailWidget/ProposalDetailWidget.style";

const ProposalDetailWidget: React.FC<IProposalDetailWidgetParams> = ({
  onProposalListNavigate,
  proposalId,
}: IProposalDetailWidgetParams) => {
  const classes = useStyles();
  const { coreProxy, viewUtils } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();
  const [proposal, setProposal] = useState<Proposal>();
  const [blockNumber, setBlockNumber] = useState<number>();
  const [accountAddress, setAccountAddress] =
    useState<EthereumAccountAddress>();
  const [supportStatus, setSupportStatus] = useState<EProposalVoteSupport>();
  const [proposalDescriptionFromIPFS, setProposalDescriptionFromIPFS] =
    useState<string>();

  // This is set to true for some existing proposals in rinkeby.
  const [showRawDescription, setShowRawDescription] = useState<boolean>();

  useEffect(() => {
    getProposalDetail();
    getBlockNumber();
  }, []);

  const getProposalDetail = () => {
    setLoading(true);
    coreProxy.getEthereumAccounts().map((accounts) => {
      setAccountAddress(accounts[0]);

      // delegate votes, createProposal and then list all proposals
      coreProxy.governance
        .getProposalDetails(proposalId)
        .map((proposal) => {
          setProposal(proposal);

          if (!hasProposalDescriptionHash(proposal.description)) {
            setShowRawDescription(true);
            return;
          }

          const descriptionHash = viewUtils.getProposalDescriptionHash(
            proposal.description,
          );
          coreProxy.governance
            .getProposalDescription(IpfsCID(descriptionHash))
            .map((description) => {
              setProposalDescriptionFromIPFS(description);
            })
            .mapErr(handleCoreError);
        })
        .mapErr(handleCoreError);

      getProposalVotesReceipt(accounts[0]);
    });
  };

  const getBlockNumber = () => {
    setLoading(true);

    coreProxy
      .getBlockNumber()
      .map((blockNumber) => {
        setBlockNumber(blockNumber);
      })
      .mapErr(handleCoreError);
  };

  const getProposalVotesReceipt = (account: EthereumAccountAddress) => {
    setLoading(true);

    coreProxy.governance
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
    coreProxy.governance
      .queueProposal(proposalId)
      .map((proposal) => {
        setProposal(proposal);
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const cancelProposal = () => {
    setLoading(true);
    coreProxy.governance
      .cancelProposal(proposalId)
      .map((proposal) => {
        setProposal(proposal);
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const executeProposal = () => {
    setLoading(true);
    coreProxy.governance
      .executeProposal(proposalId)
      .map((proposal) => {
        setProposal(proposal);
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const castVote = (voteSupport: EProposalVoteSupport) => {
    setLoading(true);
    coreProxy.governance
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
        <Typography variant="h6" className={classes.proposalDetailsLabel}>
          Details:
        </Typography>
        <Box className={classes.sectionWrapper}>
          <Typography variant="body1" className={classes.sectionLabel}>
            Proposer
          </Typography>
          <Typography variant="body1" className={classes.sectionValue}>
            {proposal?.originator}
          </Typography>
        </Box>
        <Box className={classes.sectionWrapper}>
          <Typography variant="body1" className={classes.sectionLabel}>
            Current Block
          </Typography>
          <Typography variant="body1" className={classes.sectionValue}>
            {blockNumber}
          </Typography>
        </Box>
        <Box className={classes.sectionWrapper}>
          <Typography variant="body1" className={classes.sectionLabel}>
            Start Block
          </Typography>
          <Typography variant="body1" className={classes.sectionValue}>
            {proposal?.startBlock}
          </Typography>
        </Box>
        <Box className={classes.sectionWrapper}>
          <Typography variant="body1" className={classes.sectionLabel}>
            End Block
          </Typography>
          <Typography variant="body1" className={classes.sectionValue}>
            {proposal?.endBlock}
          </Typography>
        </Box>
        <GovernanceMarkdown
          source={
            showRawDescription
              ? proposal?.description
              : proposalDescriptionFromIPFS
          }
        />
      </Box>
    </Box>
  );
};

export default ProposalDetailWidget;
