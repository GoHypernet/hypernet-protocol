import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { IRenderParams } from "@web-ui/interfaces";
import { useAlert } from "react-alert";

import { BoxWrapper } from "@web-ui/components";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { EthereumAddress, Proposal } from "@hypernetlabs/objects";

interface IProposalsWidget extends IRenderParams {}

const ProposalsWidget: React.FC<IProposalsWidget> = ({
  includeBoxWrapper,
  bodyStyle,
}: IProposalsWidget) => {
  const alert = useAlert();
  const { coreProxy, UIData } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    // delegate votes, createProposal and then list all proposals
    /* coreProxy
      .delegateVote(
        EthereumAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
        null,
      )
      .map(() => {
        console.log("delegate worked123");
        coreProxy.getEthereumAccounts().map((accounts) => {
          console.log("getEthereumAccounts accounts123: ", accounts);
          coreProxy
            .createProposal(
              "first proposal name4",
              "proposal symbol1",
              EthereumAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
            )
            .map((proposal) => {
              console.log("proposal FE: ", proposal);
              coreProxy
                .getProposals()
                .map((proposals) => {
                  console.log("proposals list: ", proposals);
                  setProposals(proposals);
                })
                .mapErr(handleError);
            })
            .mapErr(handleError);
        });
      })
      .mapErr(handleError); */

    // list all proposals
    coreProxy
      .getProposals()
      .map((proposals) => {
        console.log("proposal list: ", proposals);
        setProposals(proposals);
      })
      .mapErr(handleError);

    coreProxy
      .getProposals([2])
      .map((proposals) => {
        console.log("proposal list detail: ", proposals);
        setProposals(proposals);
      })
      .mapErr(handleError);
  }, []);

  const handleError = (err?: Error) => {
    console.log("handleError err: ", err);
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  const CustomBox = includeBoxWrapper ? BoxWrapper : Box;

  return (
    <CustomBox label="Current state channel" bodyStyle={bodyStyle}>
      <Box>ProposalsWidget</Box>
    </CustomBox>
  );
};

export default ProposalsWidget;
