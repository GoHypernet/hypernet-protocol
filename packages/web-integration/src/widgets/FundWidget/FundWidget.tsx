import React, { useState, useContext } from "react";
import { StoreContext } from "../../contexts";
import { TokenSelector, Button } from "@hypernetlabs/web-ui";

interface IResultMessage {
  status?: string;
  message?: string;
}

const FundWidget: React.FC = () => {
  const { tokenSelectorOptions, selectedPaymentToken, setSelectedPaymentToken /* depositFunds */ } = useContext(
    StoreContext,
  );
  const [resultMessage, setResultMessage] = useState<IResultMessage>();

  const handleDepositFundClick = () => {
    /* depositFunds().match(
      (balances) => {
        // show success message
        setResultMessage({
          status: "success",
          message: "you fund has succeeded",
        });
      },
      (err) => {
        //handle error
        setResultMessage({
          status: "failure",
          message: "you fund has failed",
        });
      },
    ); */
  };

  if (resultMessage?.message) {
    return <div>{resultMessage.message}</div>;
  }

  return (
    <div>
      <TokenSelector
        tokenSelectorOptions={tokenSelectorOptions}
        selectedPaymentToken={selectedPaymentToken}
        setSelectedPaymentToken={setSelectedPaymentToken}
      />
      <br />
      <Button onClick={handleDepositFundClick} disabled={!selectedPaymentToken?.address} label="Fund" />
    </div>
  );
};

export default FundWidget;
