import React from "react";

import useStyles from "@web-ui/widgets/MerchantsWidget/MerchantsWidget.style";

interface IMerchantsWidget {
  noLabel?: boolean;
}

const MerchantsWidget: React.FC<IMerchantsWidget> = ({
  noLabel,
}: IMerchantsWidget) => {
  const classes = useStyles();

  return <div>MerchantsWidget</div>;
};

export default MerchantsWidget;
