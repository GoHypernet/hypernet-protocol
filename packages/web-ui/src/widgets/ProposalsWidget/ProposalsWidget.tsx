import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernancePagination,
  GovernanceProposalListItem,
  GovernanceWidgetHeader,
} from "@web-ui/components";
import { IProposalsWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { Proposal } from "@hypernetlabs/objects";
import DelegateVotesWidget from "@web-ui/widgets/DelegateVotesWidget";

const getPageItemIndexList = (
  totalItems: number,
  currentPage: number,
  itemsPerPage: number,
) => {
  const proposalNumberArr: number[] = [];
  if (totalItems) {
    for (let i = 1; i <= Math.min(totalItems, itemsPerPage); i++) {
      // Get indices from current page backwards.
      const index = totalItems - (currentPage - 1) * itemsPerPage - i + 1;
      // Proposals starts with index one.
      if (index > 0) {
        proposalNumberArr.push(index);
      }
    }
  }
  return proposalNumberArr;
};

const PROPOSALS_PER_PAGE = 10;

const ProposalsWidget: React.FC<IProposalsWidgetParams> = ({
  onProposalCreationNavigate,
  onProposalDetailsNavigate,
}: IProposalsWidgetParams) => {
  const alert = useAlert();
  const { coreProxy, UIData } = useStoreContext();
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
          console.log("proposal list: ", proposals);
          setProposals(proposals);
        })
        .mapErr(handleError);
    }
  }, [JSON.stringify(proposalsNumberArr)]);

  const handleError = (err?: Error) => {
    console.log("handleError err: ", err);
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
            onProposalDetailsNavigate &&
            onProposalDetailsNavigate(proposal.id._hex)
          }
          key={proposal.id._hex}
          number={proposal.proposalNumber?.toString() || ""}
          title={proposal.description}
          status={proposal.state}
        />
      ))}
      {proposalCount && (
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
