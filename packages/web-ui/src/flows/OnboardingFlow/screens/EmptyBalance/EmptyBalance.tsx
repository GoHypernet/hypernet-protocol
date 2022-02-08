import React, { useEffect } from "react";

import { GovernanceButton, GovernanceTypography } from "@web-ui/components";

import { useLayoutContext } from "@web-ui/contexts";
import { AUTHENTICATION_SUCCESS_IMAGE_URL } from "@web-ui/constants";
import { useStyles } from "@web-ui/flows/OnboardingFlow/screens/EmptyBalance/EmptyBalance.style";

interface IEmptyBalanceProps {
  gatewayName: string;
  handleFundButtonClick: () => void;
}

const EmptyBalance: React.FC<IEmptyBalanceProps> = (
  props: IEmptyBalanceProps,
) => {
  const { gatewayName, handleFundButtonClick } = props;
  const { setModalHeader } = useLayoutContext();
  const classes = useStyles();

  useEffect(() => {
    setModalHeader("Connection Success");

    return () => {
      setModalHeader("");
    };
  }, []);

  return (
    <>
      <GovernanceTypography
        className={classes.subtitle}
        variant="subtitle1"
        align="left"
      >
        {`You have successfully connected your wallet and authorized ${gatewayName} to proccess payments.`}
      </GovernanceTypography>
      <img
        className={classes.authenticationSuccessImg}
        src={AUTHENTICATION_SUCCESS_IMAGE_URL}
      />
      <GovernanceTypography
        className={classes.subtitle}
        variant="subtitle1"
        align="left"
      >
        Currently there are no tokens in your Hypernet account. Next, fund your
        Hypernet account to make payments.
      </GovernanceTypography>

      <GovernanceButton
        className={classes.fundButton}
        color="primary"
        variant="contained"
        fullWidth
        onClick={handleFundButtonClick}
      >
        Fund My Wallet
      </GovernanceButton>
    </>
  );
};

export default EmptyBalance;
