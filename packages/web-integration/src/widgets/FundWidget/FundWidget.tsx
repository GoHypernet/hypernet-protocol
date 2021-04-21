import { TokenSelector, Button, TextInput } from "@hypernetlabs/web-ui";
import React from "react";

import { useFund } from "@web-integration-hooks";

const FundWidget: React.FC = () => {
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
    <div>
      <TokenSelector
        tokenSelectorOptions={tokenSelectorOptions}
        selectedPaymentToken={selectedPaymentToken}
        setSelectedPaymentToken={setSelectedPaymentToken}
      />
      <br />
      <TextInput label="Amount" value={amount} onChange={setAmount} />
      <br />
      <Button onClick={depositFunds} disabled={!selectedPaymentToken?.address} label="Fund" />
      <br />
      <br />
      <Button onClick={mintTokens} label="Mint HyperToken" />
      <br />
      <h3>{resultMessage?.message}</h3>
    </div>
  );
};

export default FundWidget;
