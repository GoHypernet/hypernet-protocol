import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceProposalListItem,
  GovernanceWidgetHeader,
} from "@web-ui/components";
import { IProposalsWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { EthereumAddress, Proposal } from "@hypernetlabs/objects";
import DelegateVotesWidget from "@web-ui/widgets/DelegateVotesWidget";

const ProposalsWidget: React.FC<IProposalsWidgetParams> = ({
  onProposalCreationNavigate,
}: IProposalsWidgetParams) => {
  const alert = useAlert();
  const { coreProxy, UIData } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [delegateVotesModalOpen, setDelegateVotesModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const address = EthereumAddress(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    );
    coreProxy.getEthereumAccounts().map((accounts) => {
      console.log("accounts: ", accounts);
    });
    // delegate votes, createProposal and then list all proposals
    coreProxy
      .getProposals()
      .map((proposals) => {
        console.log("proposal list: ", proposals);
        setProposals(proposals);
      })
      .mapErr(handleError);

    /* coreProxy
      .createProposal("first proposal name", "proposal symbol1", address)
      .map((proposal) => {
        console.log("created proposal FE: ", proposal);

        // get proposal details
        const propsalId = proposal.id;
        coreProxy
          .getProposalDetails(propsalId)
          .map((proposal) => {
            console.log("proposal detail from getProposalDetails: ", proposal);

            // get cast a new vote
            coreProxy
              .castVote(propsalId, EVoteSupport.FOR)
              .map((proposal) => {
                console.log("proposal detail from castVote: ", proposal);

                // get vote history
                coreProxy
                  .getProposalVotesReceipt(propsalId, address)
                  .map((proposal) => {
                    console.log(
                      "ProposalVoteReceipt from getProposalVotesReceipt: ",
                      proposal,
                    );
                  })
                  .mapErr(handleError);
              })
              .mapErr(handleError);
          })
          .mapErr(handleError);
      })
      .mapErr(handleError); */
  }, []);

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
              console.log("go to Create Proposal");
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
          key={proposal.id}
          number={proposal.proposalNumber?.toString() || ""}
          title={proposal.description}
          status={proposal.state}
        />
      ))}
      {delegateVotesModalOpen && (
        <DelegateVotesWidget
          onCloseCallback={() => setDelegateVotesModalOpen(false)}
        />
      )}
    </Box>
  );
};

export default ProposalsWidget;
