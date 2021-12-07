import React, { useEffect, useState } from "react";
import { Box, Grid, Tooltip, Typography } from "@material-ui/core";
import { IRenderParams } from "@web-ui/interfaces";

import { GovernanceCard } from "@web-ui/components";
import { useStoreContext } from "@web-ui/contexts";
import { PublicIdentifier } from "@hypernetlabs/objects";
import { colors } from "@web-ui/theme";
import { useStyles } from "@web-ui/widgets/PublicIdentifierWidget/PublicIdentifierWidget.style";

interface IPublicIdentifierWidget extends IRenderParams {}

const PublicIdentifierWidget: React.FC<IPublicIdentifierWidget> = () => {
  const classes = useStyles();
  const { coreProxy } = useStoreContext();
  const [publicIdentifer, setPublicIdentifer] = useState<PublicIdentifier>();

  useEffect(() => {
    coreProxy.getPublicIdentifier().map((publicIdentifer) => {
      setPublicIdentifer(publicIdentifer);
    });
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid
        item
        xs={12}
        sm={12}
        md={3}
        lg={3}
        className={classes.titleContainer}
      >
        <Typography variant="body2">Hypernet Routing Number</Typography>
      </Grid>

      <Grid item xs={12} sm={12} md={9} lg={9}>
        <GovernanceCard
          className="public-identifier-widget"
          hideDivider
          title={
            <Box
              display="flex"
              alignItems="center"
              style={{ wordBreak: "break-word" }}
            >
              <Tooltip title="Online" placement="top">
                <Box
                  minHeight={14}
                  minWidth={14}
                  bgcolor={colors.GREEN700}
                  borderRadius="50%"
                  marginRight="20px"
                ></Box>
              </Tooltip>
              <Typography variant="body1">{publicIdentifer}</Typography>
            </Box>
          }
        />
      </Grid>
    </Grid>
  );
};

export default PublicIdentifierWidget;
