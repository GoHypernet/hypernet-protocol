import { IRenderParams } from "@web-ui/interfaces";
import React from "react";

import {
  GovernanceButton,
  GovernanceCard,
  GovernanceDialogSelectField,
  GovernanceField,
} from "@web-ui/components";
import { useFund } from "@web-ui/hooks";
import { useStyles } from "@web-ui/widgets/FundWidget/FundWidget.style";
import { Form, Formik } from "formik";
import { EthereumAddress } from "@hypernetlabs/objects";

interface IValues {
  amount: string;
  tokenAddress: EthereumAddress;
  stateChannelAddress: EthereumAddress;
}

interface IWithdrawWidget extends IRenderParams {}

const WithdrawWidget: React.FC<IWithdrawWidget> = ({
  noLabel,
}: IWithdrawWidget) => {
  const {
    tokenSelectorOptions,
    error,
    withdrawFunds,
    activeStateChannels = [],
    selectedStateChennel,
  } = useFund();
  const classes = useStyles({ error });

  const handleFormSubmit = (values: IValues) => {
    withdrawFunds(
      values.tokenAddress,
      values.amount,
      values.stateChannelAddress,
    );
  };

  return (
    <GovernanceCard
      className={classes.wrapper}
      title={!noLabel ? "Withdraw Funds" : undefined}
      description={
        !noLabel
          ? "Move tokens from your Hypernet account into your Ethereum wallet."
          : undefined
      }
    >
      <Formik
        enableReinitialize
        initialValues={
          {
            tokenAddress: tokenSelectorOptions[0]?.address,
            amount: "1",
            stateChannelAddress:
              selectedStateChennel?.channelAddress ||
              activeStateChannels[0]?.channelAddress,
          } as IValues
        }
        onSubmit={handleFormSubmit}
      >
        {({ handleSubmit, values }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <GovernanceDialogSelectField
                required
                title="Hypernet Account"
                name="stateChannelAddress"
                options={activeStateChannels.map((option) => ({
                  primaryText: option.channelAddress,
                  value: option.channelAddress,
                }))}
              />
              <GovernanceDialogSelectField
                required
                title="Token Selector"
                name="tokenAddress"
                options={tokenSelectorOptions.map((option) => ({
                  primaryText: option.tokenName,
                  value: option.address,
                }))}
              />
              <GovernanceField
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
                disabled={!(!!values.amount && !!values.tokenAddress)}
              >
                Withdraw to your metamask wallet
              </GovernanceButton>
            </Form>
          );
        }}
      </Formik>
    </GovernanceCard>
  );
};

export default WithdrawWidget;
