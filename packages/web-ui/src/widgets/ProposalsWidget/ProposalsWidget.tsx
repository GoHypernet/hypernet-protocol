import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernancePagination,
  GovernanceProposalListItem,
  GovernanceWidgetHeader,
  getPageItemIndexList,
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
  const { setLoading } = useLayoutContext();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [delegateVotesModalOpen, setDelegateVotesModalOpen] =
    useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [proposalCount, setProposalCount] = useState<number>(0);

  const proposalsNumberArr = useMemo(
    () => getPageItemIndexList(proposalCount, page, PROPOSALS_PER_PAGE),
    [proposalCount, page],
  );

  useEffect(() => {
    coreProxy
      .getProposalsCount()
      .map((proposalCount) => {
        setProposalCount(proposalCount);
      })
      .mapErr(handleError);
  }, []);

  useEffect(() => {
    if (proposalsNumberArr.length) {
      coreProxy
        .getProposals(proposalsNumberArr)
        .map((proposals) => {
          setProposals(proposals);
        })
        .mapErr(handleError);
    }
  }, [JSON.stringify(proposalsNumberArr)]);

  const handleError = (err?: Error) => {
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  return (
    <Box>
      <GovernanceWidgetHeader
        label="Proposals"
        headerActions={[
          {
            label: "Create Proposal",
            onClick: () => {
              onProposalCreationNavigate && onProposalCreationNavigate();
            },
            variant: "outlined",
          },
          {
            label: "Delegate Voting",
            onClick: () => setDelegateVotesModalOpen(true),
            variant: "contained",
            color: "primary",
          },
        ]}
      />
      {proposals.map((proposal) => (
        <GovernanceProposalListItem
          onClick={() =>
            onProposalDetailsNavigate && onProposalDetailsNavigate(proposal.id)
          }
          key={proposal.id}
          number={proposal.proposalNumber?.toString() || ""}
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
