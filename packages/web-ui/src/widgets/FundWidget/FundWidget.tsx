import React from "react";
import { Form, Formik } from "formik";
import { IRenderParams } from "@web-ui/interfaces";

import {
  TokenSelector,
  TextInput,
  GovernanceButton,
  GovernanceCard,
  GovernanceDialogSelectField,
  GovernanceLargeField,
} from "@web-ui/components";
import { useFund } from "@web-ui/hooks";
import { useStyles } from "@web-ui/widgets/FundWidget/FundWidget.style";

interface IValues {
  amount: string;
  tokenAddress: string;
}

interface IFundWidget extends IRenderParams {}

const FundWidget: React.FC<IFundWidget> = ({ noLabel }: IFundWidget) => {
  const {
    tokenSelectorOptions,
    selectedPaymentToken,
    setSelectedPaymentToken,
    depositFunds,
    mintTokens,
    amount,
    setAmount,
    error,
    depositFundsV2,
  } = useFund();
  const classes = useStyles({ error });

  const handleFormSubmit = (values: IValues) => {
    depositFundsV2(values.tokenAddress, values.amount);
  };

  return (
    <GovernanceCard
      className={classes.wrapper}
      title={!noLabel ? "FUND YOUR CHANNEL" : undefined}
    >
      <Formik
        initialValues={
          {
            tokenAddress: tokenSelectorOptions[0]?.address,
          } as IValues
        }
        onSubmit={handleFormSubmit}
      >
        {({ handleSubmit, values }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <GovernanceDialogSelectField
                required
                title="Token Selector"
                name="tokenAddress"
                options={tokenSelectorOptions.map((option) => ({
                  primaryText: option.tokenName,
                  value: option.address,
                }))}
              />
              <GovernanceLargeField
                required
                name="amount"
                title="Amount"
                type="input"
                placeholder="Type Amount"
              />

              <GovernanceButton
                fullWidth
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                disabled={!selectedPaymentToken?.address}
              >
                Fund my wallet
              </GovernanceButton>
            </Form>
          );
        }}
      </Formik>

      <TokenSelector
        tokenSelectorOptions={tokenSelectorOptions}
        selectedPaymentToken={selectedPaymentToken}
        setSelectedPaymentToken={setSelectedPaymentToken}
      />
      <TextInput label="Amount" value={amount} onChange={setAmount} />
    </GovernanceCard>
  );
};

export default FundWidget;
