import { Box } from "@material-ui/core";
import React, { useEffect } from "react";

import {
  GovernanceBalanceList,
  GovernanceButton,
  GovernanceTypography,
} from "@web-ui/components";

import { IOnboardingSuccessButtonProps } from "@web-ui/interfaces";
import { useLayoutContext, useStoreContext } from "@web-ui/contexts";
import { useStyles } from "@web-ui/flows/OnboardingFlow/screens/OnboardingSuccess/OnboardingSuccess.style";
import { useBalances } from "@web-ui/hooks";

interface IOnboardingSuccessProps {
  gatewayName: string;
  successButtonProps?: IOnboardingSuccessButtonProps;
  handleFundButtonClick: () => void;
}

const OnboardingSuccess: React.FC<IOnboardingSuccessProps> = (
  props: IOnboardingSuccessProps,
) => {
  const { successButtonProps, handleFundButtonClick } = props;
  const { closeModal, setModalHeader } = useLayoutContext();
  const { balances } = useBalances();
  const { viewUtils } = useStoreContext();
  const classes = useStyles();

  useEffect(() => {
    setModalHeader("Current Balance");

    return () => {
      setModalHeader("");
    };
  }, []);

  const onSuccessButtonClick = () => {
    successButtonProps?.action();
    closeModal();
  };

  return (
    <>
      <GovernanceTypography
        className={classes.subtitle}
        variant="subtitle1"
        align="left"
      >
        You are now ready to make instant and secure payments in crypto!
      </GovernanceTypography>
      <GovernanceTypography
        className={classes.subtitle}
        variant="subtitle1"
        align="left"
      >
        You can see the available balances in your Hypernet account.
      </GovernanceTypography>
      <Box display="flex">
        <GovernanceBalanceList
          viewUtils={viewUtils}
          balances={balances}
          containerClassName={classes.balanceListContainer}
        />
      </Box>
      <GovernanceButton
        className={classes.successButton}
        color="primary"
        variant="contained"
        fullWidth
        onClick={onSuccessButtonClick}
      >
        {successButtonProps?.label || "Done"}
      </GovernanceButton>

      <GovernanceButton
        className={classes.fundButton}
        fullWidth
        variant="outlined"
        color="primary"
        onClick={handleFundButtonClick}
      >
        Fund My Hypernet Account
      </GovernanceButton>
    </>
  );
};

export default OnboardingSuccess;
