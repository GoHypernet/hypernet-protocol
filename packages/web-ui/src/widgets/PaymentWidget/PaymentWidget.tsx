import {
  PublicIdentifier,
  EthereumAddress,
  GatewayUrl,
  EPaymentType,
} from "@hypernetlabs/objects";
import { EResultStatus } from "@web-ui/interfaces/objects";
import React from "react";

import {
  TokenSelector,
  Button,
  TextInput,
  SelectInput,
} from "@web-ui/components";
import { usePayment } from "@web-ui/hooks";

interface PaymentWidgetProps {
  counterPartyAccount?: PublicIdentifier;
  amount?: string;
  expirationDate?: number;
  requiredStake?: string;
  paymentTokenAddress?: EthereumAddress;
  gatewayUrl?: GatewayUrl;
  paymentType?: EPaymentType;
}

export const PaymentWidget: React.FC<PaymentWidgetProps> = (
  props: PaymentWidgetProps,
) => {
  const {
    tokenSelectorOptions,
    selectedPaymentToken,
    setSelectedPaymentToken,
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
      <br />
      <h3>{resultMessage?.message}</h3>
    </div>
  );
};
