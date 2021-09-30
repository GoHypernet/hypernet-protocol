import { Box } from "@material-ui/core";
import { IRenderParams } from "@web-ui/interfaces";
import React from "react";

import {
  TokenSelector,
  Button,
  TextInput,
  BoxWrapper,
  GovernanceButton,
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
      <GovernanceButton
        fullWidth
        color="primary"
        variant="contained"
        onClick={withdrawFunds}
        disabled={!selectedPaymentToken?.address}
      >
        Withdraw to your metamask wallet
      </GovernanceButton>
    </CustomBox>
  );
};

export default WithdrawWidget;
