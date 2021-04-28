import {
  PublicIdentifier,
  EthereumAddress,
  MerchantUrl,
} from "@hypernetlabs/objects";
import { EPaymentType } from "@hypernetlabs/objects";
import {
  TokenSelector,
  Button,
  TextInput,
  SelectInput,
} from "@hypernetlabs/web-ui";
import React from "react";

import { usePayment } from "@web-integration/hooks";
import { EResultStatus } from "@web-integration/interfaces/objects";

interface PaymentWidgetProps {
  counterPartyAccount?: PublicIdentifier;
  amount?: string;
  expirationDate?: number;
  requiredStake?: string;
  paymentTokenAddress?: EthereumAddress;
  merchantUrl?: MerchantUrl;
  paymentType?: EPaymentType;
}

export const PaymentWidget: React.FC<PaymentWidgetProps> = (
  props: PaymentWidgetProps,
) => {
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
        onChange={(val) => {
          setCounterPartyAccount(PublicIdentifier(val));
        }}
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
            onChange={setRequiredStake}
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
            onChange={setAmount}
            label="Amount:"
            placeholder="Enter Amount"
          />
          <br />
          <TextInput
            value={expirationDate}
            onChange={setExpirationDate}
            label="Expiration Date:"
            placeholder="Enter Expiration Date"
          />
          <br />
        </div>
      )}
      {paymentType && (
        <Button
          onClick={submitPaymentClick}
          disabled={!selectedPaymentToken?.address}
          label="Submit Payment"
        />
      )}
      <br />
      <h3>{resultMessage?.message}</h3>
    </div>
  );
};
