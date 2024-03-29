import { EthereumContractAddress } from "@hypernetlabs/objects";
import { IRenderParams } from "@web-ui/interfaces";
import { Form, Formik } from "formik";
import React from "react";

import {
  GovernanceButton,
  GovernanceCard,
  GovernanceDialogSelectField,
  GovernanceField,
} from "@web-ui/components";
import { useFund } from "@web-ui/hooks";

interface IValues {
  amount: string;
  tokenAddress: EthereumContractAddress;
  stateChannelAddress: EthereumContractAddress;
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

  const handleFormSubmit = (values: IValues) => {
    withdrawFunds(
      values.tokenAddress,
      values.amount,
      values.stateChannelAddress,
    );
  };

  return (
    <GovernanceCard
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
                  primaryText: `${option.name} Chain ID:${option.chainId}`,
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
