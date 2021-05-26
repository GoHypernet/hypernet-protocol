import React from "react";
import { Box } from "@material-ui/core";

import {
  TokenSelector,
  Button,
  TextInput,
  BoxWrapper,
} from "@web-ui/components";
import { useFund } from "@web-ui/hooks";
import { IRenderParams } from "@web-ui/interfaces";
import { useStyles } from "@web-ui/widgets/FundWidget/FundWidget.style";

interface IFundWidget extends IRenderParams {}

const FundWidget: React.FC<IFundWidget> = ({
  includeBoxWrapper,
  noLabel,
  bodyStyle,
}: IFundWidget) => {
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

  const CustomBox = includeBoxWrapper ? BoxWrapper : Box;

  return (
    <CustomBox
      className={classes.wrapper}
      label={!noLabel ? "FUND YOUR CHANNEL" : undefined}
      bodyStyle={bodyStyle}
    >
      <TokenSelector
        tokenSelectorOptions={tokenSelectorOptions}
        selectedPaymentToken={selectedPaymentToken}
        setSelectedPaymentToken={setSelectedPaymentToken}
      />
      <TextInput label="Amount" value={amount} onChange={setAmount} />
      <Button
        onClick={depositFunds}
        disabled={!selectedPaymentToken?.address}
        fullWidth
        hasMaterialUIStyle
        label="Fund your Wallet"
      />
      {/* <Button onClick={mintTokens} label="Mint HyperToken" />
      <br /> */}
    </CustomBox>
  );
};

export default FundWidget;
