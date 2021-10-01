import React, { useEffect, useState } from "react";
import { Box, Tooltip, Typography } from "@material-ui/core";
import { IRenderParams } from "@web-ui/interfaces";

import { BoxWrapper, GovernanceCard } from "@web-ui/components";
import { useStoreContext } from "@web-ui/contexts";
import { PublicIdentifier } from "@hypernetlabs/objects";
import { colors } from "@web-integration/theme";

interface IPublicIdentifierWidget extends IRenderParams {}

const PublicIdentifierWidget: React.FC<IPublicIdentifierWidget> = ({
  includeBoxWrapper,
}: IPublicIdentifierWidget) => {
  const { coreProxy } = useStoreContext();
  const [publicIdentifer, setPublicIdentifer] = useState<PublicIdentifier>();

  useEffect(() => {
    coreProxy.getPublicIdentifier().map((publicIdentifer) => {
      setPublicIdentifer(publicIdentifer);
    });
  }, []);

  return (
    <GovernanceCard
      className="public-identifier-widget"
      hideDivider
      title={
        <Box display="flex" alignItems="center">
          <Tooltip title="Online" placement="top">
            <Box
              height="15px"
              width="15px"
              bgcolor={colors.GREEN700}
              borderRadius="50%"
              marginRight="20px"
            ></Box>
          </Tooltip>
          <Typography variant="h5">{publicIdentifer}</Typography>
        </Box>
      }
    />
  );
};

export default PublicIdentifierWidget;
