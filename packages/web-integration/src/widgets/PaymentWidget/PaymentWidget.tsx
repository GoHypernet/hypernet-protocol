import React, { useState } from "react";
import { TokenSelector, Button } from "@hypernetlabs/web-ui";
import { PublicIdentifier, EthereumAddress, PublicKey, EPaymentType } from "@hypernetlabs/hypernet-core";
import { useFund } from "../../hooks";

interface PaymentWidgetProps {
  counterPartyAccount?: PublicIdentifier;
  amount?: string;
  expirationDate?: moment.Moment;
  requiredStake?: string;
  paymentToken?: EthereumAddress;
  disputeMediator?: PublicKey;
  paymentType?: EPaymentType;
}

interface IResultMessage {
  status?: string;
  message?: string;
}

const PaymentWidget: React.FC<PaymentWidgetProps> = (props: PaymentWidgetProps) => {
  const {
    counterPartyAccount,
    amount,
    expirationDate,
    requiredStake,
    paymentToken,
    disputeMediator,
    paymentType,
  } = props;
  const { tokenSelectorOptions, selectedPaymentToken, setSelectedPaymentToken, depositFunds } = useFund();
  const [resultMessage, setResultMessage] = useState<IResultMessage>();

  const submitPaymentClick = () => {
    depositFunds().match(
      (balances) => {
        // show success message
        setResultMessage({
          status: "success",
          message: "you fund has succeeded",
        });
      },
      (err) => {
        console.log("err: ", err);
        //handle error
        setResultMessage({
          status: "failure",
          message: err.message || "you fund has failed",
        });
      },
    );
  };

  if (resultMessage?.status === "success") {
    return (
      <div>
        <h3>{resultMessage.message}</h3>
      </div>
    );
  }

  return (
    <div>
      <h4>PaymentWidget</h4>
      <TokenSelector
        tokenSelectorOptions={tokenSelectorOptions}
        selectedPaymentToken={selectedPaymentToken}
        setSelectedPaymentToken={setSelectedPaymentToken}
      />
      <br />
      <Button onClick={submitPaymentClick} disabled={!selectedPaymentToken?.address} label="Submit Payment" />
      <br />
      <h3>{resultMessage?.message}</h3>
    </div>
  );
};

export default PaymentWidget;
