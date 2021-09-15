import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { IRenderParams } from "@web-ui/interfaces";
import { useAlert } from "react-alert";

import { BoxWrapper } from "@web-ui/components";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { Proposal } from "@hypernetlabs/objects";

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
    coreProxy
      .getProposals()
      .map((proposals) => {
        console.log("proposals: ", proposals);
        setProposals(proposals);
      })
      .mapErr(handleError);
  }, []);

  const handleError = (err?: Error) => {
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
