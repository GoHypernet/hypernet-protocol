import React from "react";
import { Box } from "@material-ui/core";

import { useStyles } from "@web-ui/widgets/MerchantsWidget/MerchantsWidget.style";

interface IMerchantsWidget {
  noLabel?: boolean;
}

const MerchantsWidget: React.FC<IMerchantsWidget> = ({
  noLabel,
}: IMerchantsWidget) => {
  const classes = useStyles();

  return <Box>MerchantsWidget</Box>;
};

export default MerchantsWidget;
