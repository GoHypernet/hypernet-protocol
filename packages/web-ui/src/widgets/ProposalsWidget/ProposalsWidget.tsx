import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";

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
  const { coreProxy, viewUtils } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [delegateVotesModalOpen, setDelegateVotesModalOpen] =
    useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [proposalCount, setProposalCount] = useState<number>(0);
  const [hasEmptyState, setHasEmptyState] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    coreProxy
      .getProposalsCount()
      .map((proposalCount) => {
        setProposalCount(proposalCount);
        if (!proposalCount) {
          setHasEmptyState(true);
        }
        setLoading(false);
      })
      .mapErr(handleCoreError);
  }, []);

  useEffect(() => {
    setLoading(true);
    coreProxy
      .getProposals(page, PROPOSALS_PER_PAGE)
      .map((proposals) => {
        setProposals(proposals);
        setLoading(false);
      })
      .mapErr(handleCoreError);
  }, [page]);

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

      {proposals.map((proposal) => {
        const proposalName = viewUtils.getProposalName(proposal.description);
        return (
          <GovernanceProposalListItem
            onClick={() =>
              onProposalDetailsNavigate &&
              onProposalDetailsNavigate(proposal.id)
            }
            key={proposal.id}
            number={
              proposal.proposalNumber != null
                ? (proposal.proposalNumber + 1).toString()
                : "-"
            }
            title={proposalName}
            status={proposal.state}
          />
        );
      })}
      {!!proposalCount && (
        <GovernancePagination
          customPageOptions={{
            itemsPerPage: PROPOSALS_PER_PAGE,
            totalItems: proposalCount,
            currentPage: page,
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
