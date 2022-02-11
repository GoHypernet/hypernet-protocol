import { EthereumContractAddress } from "@hypernetlabs/objects";
import { IRenderParams } from "@web-ui/interfaces";
import { Form, Formik } from "formik";
import React, { useMemo } from "react";
import { Box } from "@material-ui/core";

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

interface IFundWidget extends IRenderParams {
  selectType?: "dialog" | "dropdown";
}

const FundWidget: React.FC<IFundWidget> = ({
  noHeader,
  noLabel,
  excludeCardWrapper,
  selectType = "dialog",
}: IFundWidget) => {
  const {
    tokenSelectorOptions,
    error,
    depositFunds,
    activeStateChannels = [],
    stateChannelsFetched,
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

  if (!stateChannelsFetched) {
    return null;
  }

  return (
    <GovernanceCard
      {...(excludeCardWrapper && { className: classes.nudeCard })}
      title={!noHeader ? "Deposit Funds" : undefined}
      hideDivider={excludeCardWrapper}
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
        {({ handleSubmit, values, setFieldValue }) => {
          return (
            <Form onSubmit={handleSubmit}>
              {selectType === "dialog" ? (
                <>
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
                      primaryText: option.name,
                      value: option.address,
                    }))}
                  />
                </>
              ) : (
                <>
                  <GovernanceField
                    required
                    type="select"
                    title="Hypernet Account"
                    name="stateChannelAddress"
                    options={uniqueActiveStateChannels.map((option) => ({
                      label: option.channelAddress,
                      value: option.channelAddress,
                    }))}
                  />
                  <GovernanceField
                    required
                    title="Token Selector"
                    name="tokenAddress"
                    type="select"
                    options={tokenSelectorOptions?.map((option) => ({
                      label: (
                        <Box display="flex" alignItems="center" p={0}>
                          {option.logoUrl && (
                            <img
                              src={option.logoUrl}
                              style={{ width: 20, height: 20, marginRight: 8 }}
                            />
                          )}
                          {option.name}
                        </Box>
                      ),
                      value: option.address,
                    }))}
                  />
                </>
              )}

              <GovernanceField
                required
                name="amount"
                title="Amount"
                type="input"
                placeholder="Type Amount"
                inputProps={{
                  type: "number",
                }}
              />

              <GovernanceButton
                fullWidth
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                disabled={
                  !(
                    !!values.amount &&
                    !!values.tokenAddress &&
                    !!values.stateChannelAddress
                  )
                }
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
