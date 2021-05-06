import React from "react";

import { TokenSelector } from "@web-ui/components";
import { useBalances } from "@web-ui/hooks";
import useStyles from "@web-ui/widgets/PreferredTokenSelection/PreferredTokenSelection.style";

const PreferredTokenSelection: React.FC = () => {
  const {
    channelTokenSelectorOptions,
    preferredPaymentToken,
    setPreferredPaymentToken,
  } = useBalances();

  const classes = useStyles();

  return (
    <div className={classes.preferredTokenWrapper}>
      <div className={classes.preferredTokenLabel}>
        Select your preferred token:
      </div>
      <TokenSelector
        tokenSelectorOptions={channelTokenSelectorOptions}
        selectedPaymentToken={preferredPaymentToken}
        setSelectedPaymentToken={setPreferredPaymentToken}
      />
    </div>
  );
};

export default PreferredTokenSelection;
