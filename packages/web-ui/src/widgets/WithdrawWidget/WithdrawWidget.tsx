import { Box } from "@material-ui/core";
import { IRenderParams } from "@web-ui/interfaces";
import React from "react";

import {
  TokenSelector,
  Button,
  TextInput,
  BoxWrapper,
} from "@web-ui/components";
import { useFund } from "@web-ui/hooks";
import { useStyles } from "@web-ui/widgets/FundWidget/FundWidget.style";

interface IWithdrawWidget extends IRenderParams {}

const WithdrawWidget: React.FC<IWithdrawWidget> = ({
  includeBoxWrapper,
  noLabel,
  bodyStyle,
}: IWithdrawWidget) => {
  const {
    tokenSelectorOptions,
    selectedPaymentToken,
    setSelectedPaymentToken,
    depositFunds,
    withdrawFunds,
    setDestinationAddress,
    amount,
    setAmount,
    error,
  } = useFund();
  const classes = useStyles({ error });

  const CustomBox = includeBoxWrapper ? BoxWrapper : Box;

  return (
    <CustomBox
      className={classes.wrapper}
      label={!noLabel ? "Withdraw Funds" : undefined}
      bodyStyle={bodyStyle}
    >
      <TokenSelector
        tokenSelectorOptions={tokenSelectorOptions}
        selectedPaymentToken={selectedPaymentToken}
        setSelectedPaymentToken={setSelectedPaymentToken}
      />
      <TextInput label="Amount" value={amount} onChange={setAmount} />
      <Button
        label="Withdraw to your metamask wallet"
        disabled={!selectedPaymentToken?.address}
        onClick={withdrawFunds}
        fullWidth={true}
        bgColor="linear-gradient(98deg, rgba(0,120,255,1) 0%, rgba(126,0,255,1) 100%)"
      />
    </CustomBox>
  );
};

export default WithdrawWidget;
