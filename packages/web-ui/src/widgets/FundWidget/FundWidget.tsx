import { EthereumContractAddress } from "@hypernetlabs/objects";
import { IRenderParams } from "@web-ui/interfaces";
import { Form, Formik } from "formik";
import React, { useMemo } from "react";

import {
  GovernanceButton,
  GovernanceCard,
  GovernanceDialogSelectField,
  GovernanceField,
} from "@web-ui/components";
import { useFund } from "@web-ui/hooks";
import { useStyles } from "@web-ui/widgets/FundWidget/FundWidget.style";

interface IValues {
  amount: string;
  tokenAddress: EthereumContractAddress;
  stateChannelAddress: EthereumContractAddress;
}

interface IFundWidget extends IRenderParams {}

const FundWidget: React.FC<IFundWidget> = ({ noLabel }: IFundWidget) => {
  const {
    tokenSelectorOptions,
    error,
    depositFunds,
    activeStateChannels = [],
    selectedStateChennel,
  } = useFund();
  const classes = useStyles({ error });

  const handleFormSubmit = (values: IValues) => {
    depositFunds(
      values.tokenAddress,
      values.amount,
      values.stateChannelAddress,
    );
  };

  const uniqueActiveStateChannels = useMemo(
    () =>
      activeStateChannels.filter((stateChannel, index, self) => {
        return (
          index ===
          self.findIndex(
            (item) => item.channelAddress === stateChannel.channelAddress,
          )
        );
      }),
    [JSON.stringify(activeStateChannels)],
  );

  return (
    <GovernanceCard
      className={classes.wrapper}
      title={!noLabel ? "Deposit Funds" : undefined}
      description={
        !noLabel
          ? "Move tokens from your Ethereum wallet into your Hypernet account."
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
              uniqueActiveStateChannels[0]?.channelAddress,
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
                options={uniqueActiveStateChannels.map((option) => ({
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
