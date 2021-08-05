import React, { useEffect, useState } from "react";
import { Box, Tooltip } from "@material-ui/core";
import { IRenderParams } from "@web-ui/interfaces";

import { BoxWrapper } from "@web-ui/components";
import { useStoreContext } from "@web-ui/contexts";
import { PublicIdentifier } from "@hypernetlabs/objects";

interface IPublicIdentifierWidget extends IRenderParams {}

const PublicIdentifierWidget: React.FC<IPublicIdentifierWidget> = ({
  includeBoxWrapper,
  bodyStyle,
}: IPublicIdentifierWidget) => {
  const { coreProxy } = useStoreContext();
  const [publicIdentifer, setPublicIdentifer] = useState<PublicIdentifier>();

  useEffect(() => {
    coreProxy.getPublicIdentifier().map((publicIdentifer) => {
      setPublicIdentifer(publicIdentifer);
    });
  }, []);

  const CustomBox = includeBoxWrapper ? BoxWrapper : Box;

  return (
    <CustomBox
      label={
        <Box display="flex" alignItems="center">
          <Tooltip title="Online" placement="top">
            <Box
              height="15px"
              width="15px"
              bgcolor="#50ef7a"
              borderRadius="50%"
              marginRight="20px"
            ></Box>
          </Tooltip>
          <Box>{publicIdentifer}</Box>
        </Box>
      }
      bodyStyle={bodyStyle}
    ></CustomBox>
  );
};

export default PublicIdentifierWidget;
