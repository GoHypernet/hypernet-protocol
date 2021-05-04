import React from "react";

import {
  TokenSelector,
  Button,
  TextInput,
  ModalHeader,
  ModalFooter,
} from "@web-ui/components";
import { useFund } from "@web-ui/hooks";
import useStyles from "@web-ui/widgets/FundWidget/FundWidget.style";

const FundWidget: React.FC = () => {
  const classes = useStyles();
  const {
    tokenSelectorOptions,
    selectedPaymentToken,
    setSelectedPaymentToken,
    depositFunds,
    mintTokens,
    resultMessage,
    amount,
    setAmount,
  } = useFund();

  return (
    <div className={classes.wrapper}>
      <ModalHeader />
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
      <h3>{resultMessage?.message}</h3>
      <ModalFooter />
    </div>
  );
};

export default FundWidget;
