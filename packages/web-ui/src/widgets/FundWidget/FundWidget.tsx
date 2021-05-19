import React from "react";
import { Box } from "@material-ui/core";

import { TokenSelector, Button, TextInput } from "@web-ui/components";
import { useFund } from "@web-ui/hooks";
import { useStyles } from "@web-ui/widgets/FundWidget/FundWidget.style";

const FundWidget: React.FC = () => {
  const {
    tokenSelectorOptions,
    selectedPaymentToken,
    setSelectedPaymentToken,
    depositFunds,
    mintTokens,
    amount,
    setAmount,
    error,
  } = useFund();
  const classes = useStyles({ error });

  return (
    <Box className={classes.wrapper}>
      <TokenSelector
        tokenSelectorOptions={tokenSelectorOptions}
        selectedPaymentToken={selectedPaymentToken}
        setSelectedPaymentToken={setSelectedPaymentToken}
      />
      <TextInput label="Amount" value={amount} onChange={setAmount} />
      <Button
        onClick={depositFunds}
        disabled={!selectedPaymentToken?.address}
        fullWidth
        hasMaterialUIStyle
        label="Fund your Wallet"
      />
      {/* <Button onClick={mintTokens} label="Mint HyperToken" />
      <br /> */}
    </Box>
  );
};

export default FundWidget;
