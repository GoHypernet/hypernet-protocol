import React from "react";
import { Form, Formik } from "formik";
import { IRenderParams } from "@web-ui/interfaces";

import {
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
  } = useFund();
  const classes = useStyles({ error });

  const handleFormSubmit = () => {
    depositFunds();
  };

  return (
    <GovernanceCard
      className={classes.wrapper}
      title={!noLabel ? "Deposit Funds" : undefined}
      description={!noLabel ? "Move tokens from your Ethereum wallet into your Hypernet Protocol account." : undefined}
    >
      <Formik
        initialValues={
          {
            tokenAddress: tokenSelectorOptions[0]?.address,
            amount,
          } as IValues
        }
        onSubmit={handleFormSubmit}
      >
        {({ handleSubmit, values }) => {
          if (values["tokenAddress"] !== selectedPaymentToken?.address) {
            setSelectedPaymentToken(
              tokenSelectorOptions.find(
                (option) => option.address === values["tokenAddress"],
              ),
            );
          }
          if (values["amount"] !== amount) {
            setAmount(values["amount"]);
          }
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
                disabled={!selectedPaymentToken?.address || !amount}
              >
                Fund my wallet
              </GovernanceButton>
            </Form>
          );
        }}
      </Formik>
    </GovernanceCard>
  );
};

export default FundWidget;
