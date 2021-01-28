import React from "react";
import { TokenSelector, Button, TextInput, SelectInput } from "@hypernetlabs/web-ui";
import { PublicIdentifier, EthereumAddress, PublicKey, EPaymentType } from "@hypernetlabs/hypernet-core";
import { EResultStatus } from "../../viewModel";
import { usePayment } from "../../hooks";
import { ITokenSelectorOption } from "@hypernetlabs/web-ui/src/interfaces";

interface PaymentWidgetProps {
  counterPartyAccount?: PublicIdentifier;
  amount?: string;
  expirationDate?: moment.Moment;
  requiredStake?: string;
  paymentTokenAddress?: EthereumAddress;
  disputeMediator?: PublicKey;
  paymentType?: EPaymentType;
}

const PaymentWidget: React.FC<PaymentWidgetProps> = (props: PaymentWidgetProps) => {
  const {
    tokenSelectorOptions,
    selectedPaymentToken,
    setSelectedPaymentToken,
    sendFunds,
    setCounterPartyAccount,
    counterPartyAccount,
    paymentType,
    setExpirationDate,
    setAmount,
    setPaymentType,
    setRequiredStake,
    paymentTypeOptions,
    amount,
    requiredStake,
    expirationDate,
    resultMessage,
  } = usePayment({ ...props });

  const submitPaymentClick = () => {
    sendFunds();
  };

  if (resultMessage?.status === EResultStatus.SUCCESS) {
    return (
      <div>
        <h3>{resultMessage.message}</h3>
      </div>
    );
  }
  return (
    <div>
      <h3>Create Payment</h3>
      <br />
      <TextInput
        value={counterPartyAccount}
        onChange={(event) => setCounterPartyAccount(event.target.value)}
        label="public identifier"
        placeholder="Enter public identifier"
      />
      <br />
      <SelectInput
        value={paymentType}
        onChange={(event) => setPaymentType(event.target.value as EPaymentType)}
        options={paymentTypeOptions}
        optionValueKey="type"
        optionLabelKey="typeName"
      />
      <br />
      {paymentType === EPaymentType.Push && (
        <div>
          <TextInput
            value={requiredStake}
            onChange={(event) => setRequiredStake(event.target.value)}
            label="Required Stake:"
            placeholder="Enter Required Stake"
          />
          <br />
          <TokenSelector
            tokenSelectorOptions={tokenSelectorOptions}
            selectedPaymentToken={selectedPaymentToken}
            setSelectedPaymentToken={setSelectedPaymentToken}
          />
          <br />
          <TextInput
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            label="Amount:"
            placeholder="Enter Amount"
          />
          <br />
          <TextInput
            value={expirationDate}
            onChange={(event) => setExpirationDate(event.target.value)}
            label="Expiration Date:"
            placeholder="Enter Expiration Date"
          />
          <br />
        </div>
      )}
      {paymentType && (
        <Button onClick={submitPaymentClick} disabled={!selectedPaymentToken?.address} label="Submit Payment" />
      )}
      <br />
      <h3>{resultMessage?.message}</h3>
    </div>
  );
};

export default PaymentWidget;
