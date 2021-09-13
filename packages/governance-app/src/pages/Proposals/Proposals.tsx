import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { ethers, BigNumber } from "ethers";

import PageWrapper from "@governance-app/components/PageWrapper";
import { Box, Button, Typography } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";

import { useStyles } from "./Proposals.style";
import ProposalSummaryCard from "./ProposalSummaryCard";
import { PATH } from "@governance-app/containers/Router";
import { useLayoutContext, useStoreContext } from "@governance-app/contexts";
import { EProposalState } from "@web-integration/components/ProposalState";

export interface Proposal {
  id: string;
  state: EProposalState;
  proposalOriginator: string;
  proposalVotesFor: string;
  proposalVotesAgaints: string;
  proposalETA: string;
  description: string;
  proposalNumber: number;
}

const Proposals: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { governanceBlockchainProvider } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [proposalCount, setProposalCount] = useState<BigNumber>();
  const [proposals, setProposals] = useState<Proposal[]>();
  const [page, setPage] = React.useState(1);

  const NUMBER_OF_ITEM = 3;

  useEffect(() => {
    governanceBlockchainProvider.initialize().map(async () => {
      const governorContract =
        governanceBlockchainProvider.getHypernetGovernorContract();

      const proposalCount: BigNumber =
        await governorContract._proposalIdTracker();
      setProposalCount(proposalCount);

      const proposals: Proposal[] = await getProposals(
        governorContract,
        proposalCount.toNumber(),
      );
      setProposals(proposals);
      console.log("proposals", proposals);
    });
  }, [page]);

  const getProposals = async (
    governorContract: ethers.Contract,
    proposalCount: number,
  ): Promise<Proposal[]> => {
    const proposals: Proposal[] = [];
    try {
      setLoading(true);
      console.log("proposalCount", proposalCount);

      const proposalNumberArr: number[] = [];
      for (
        let i = 0;
        i < (proposalCount < NUMBER_OF_ITEM ? proposalCount : NUMBER_OF_ITEM);
        i++
      ) {
        proposalNumberArr.push(proposalCount - (page - 1) * NUMBER_OF_ITEM - i);
      }

      console.log("proposalNumberArr", proposalNumberArr);

      for await (const proposalNumber of proposalNumberArr) {
        const proposalID = await governorContract._proposalMap(proposalNumber);
        const proposal = await governorContract.proposals(proposalID);
        const proposalState = await governorContract.state(proposalID);
        const description = await governorContract.proposalDescriptions(
          proposalID,
        );
        const proposalStart = await governorContract.proposalSnapshot(
          proposalID,
        );
        const proposalDeadline = await governorContract.proposalDeadline(
          proposalID,
        );

        const p = {
          id: proposalID,
          state: proposalState.toString(),
          proposalOriginator: proposal[1],
          proposalVotesFor: proposal[5].toString(),
          proposalVotesAgaints: proposal[6].toString(),
          proposalETA: proposal[2].toString(),
          description,
          proposalNumber,
        };
        proposals.push(p);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }

    return proposals;
  };

  const handleClickCreateProposal = () => {
    history.push(PATH.CreateProposal);
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const pageCount = useMemo(() => {
    const totalItems = proposalCount?.toNumber() || 0;
    return Math.round(totalItems / 3);
  }, [proposalCount]);

  return (
    <PageWrapper>
      <Box className={classes.container}>
        <Box className={classes.titleContainer}>
          <Typography variant="h2">Proposals</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickCreateProposal}
          >
            Create Proposal
          </Button>
        </Box>

        {proposals?.map((proposal) => {
          return (
            <Box mt={2}>
              <ProposalSummaryCard proposal={proposal} />
            </Box>
          );
        })}

        <Box flex="1" display="flex" flexDirection="row-reverse" mt={2}>
          <Pagination count={pageCount} page={page} onChange={handleChange} />
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default Proposals;
