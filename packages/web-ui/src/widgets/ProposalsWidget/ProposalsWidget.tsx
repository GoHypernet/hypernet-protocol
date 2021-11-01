import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernancePagination,
  GovernanceProposalListItem,
  GovernanceWidgetHeader,
  GovernanceEmptyState,
  GovernanceButton,
} from "@web-ui/components";
import { IProposalsWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { Proposal } from "@hypernetlabs/objects";
import DelegateVotesWidget from "@web-ui/widgets/DelegateVotesWidget";

const PROPOSALS_PER_PAGE = 10;

const ProposalsWidget: React.FC<IProposalsWidgetParams> = ({
  onProposalCreationNavigate,
  onProposalDetailsNavigate,
}: IProposalsWidgetParams) => {
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { loading, setLoading } = useLayoutContext();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [delegateVotesModalOpen, setDelegateVotesModalOpen] =
    useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [proposalCount, setProposalCount] = useState<number>(0);
  const [hasEmptyState, setHasEmptyState] = useState<boolean>(false);

  useEffect(() => {
    coreProxy
      .getProposalsCount()
      .map((proposalCount) => {
        setProposalCount(proposalCount);
        if (!proposalCount) {
          setHasEmptyState(true);
        }
      })
      .mapErr(handleError);
  }, []);

  useEffect(() => {
    coreProxy
      .getProposals(page, PROPOSALS_PER_PAGE)
      .map((proposals) => {
        setProposals(proposals);
      })
      .mapErr(handleError);
  }, [page]);

  const handleError = (err?: Error) => {
    setLoading(false);
    setHasEmptyState(true);
    alert.error(err?.message || "Something went wrong!");
  };

  return (
    <Box>
      <GovernanceWidgetHeader
        label="Proposals"
        rightContent={
          <Box display="flex" flexDirection="row">
            <Box marginRight="10px">
              <GovernanceButton
                color="primary"
                size="medium"
                onClick={() => {
                  onProposalCreationNavigate && onProposalCreationNavigate();
                }}
                variant="outlined"
              >
                Create Proposal
              </GovernanceButton>
            </Box>
            <GovernanceButton
              color="primary"
              size="medium"
              onClick={() => {
                setDelegateVotesModalOpen(true);
              }}
              variant="contained"
            >
              Delegate Voting
            </GovernanceButton>
          </Box>
        }
      />

      {hasEmptyState && (
        <GovernanceEmptyState
          title="No proposals found."
          description="Proposals submitted by community members will appear here."
        />
      )}

      {proposals.map((proposal) => (
        <GovernanceProposalListItem
          onClick={() =>
            onProposalDetailsNavigate && onProposalDetailsNavigate(proposal.id)
          }
          key={proposal.id}
          number={
            proposal.proposalNumber != null
              ? (proposal.proposalNumber + 1).toString()
              : "-"
          }
          title={proposal.description}
          status={proposal.state}
        />
      ))}
      {!!proposalCount && (
        <GovernancePagination
          customPageOptions={{
            itemsPerPage: PROPOSALS_PER_PAGE,
            totalItems: proposalCount,
          }}
          onChange={(_, page) => {
            setPage(page);
          }}
        />
      )}
      {delegateVotesModalOpen && (
        <DelegateVotesWidget
          onCloseCallback={() => setDelegateVotesModalOpen(false)}
        />
      )}
    </Box>
  );
};

export default ProposalsWidget;
