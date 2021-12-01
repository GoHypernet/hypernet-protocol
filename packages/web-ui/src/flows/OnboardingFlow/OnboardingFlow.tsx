import { Box } from "@material-ui/core";
import { useLayoutContext, useStoreContext } from "@web-ui/contexts";
import { IOnboardingFlowParams } from "@web-ui/interfaces";
import React, { useEffect, useState, ReactNode } from "react";
import { useAlert } from "react-alert";

import { SucessContent, ModalFooter } from "@web-ui/components";
import { useStyles } from "@web-ui/flows/OnboardingFlow/OnboardingFlow.style";
import { useBalances } from "@web-ui/hooks";
import BalancesWidget from "@web-ui/widgets/BalancesWidget/BalancesWidget";
import FundWidget from "@web-ui/widgets/FundWidget/FundWidget";
import {
  AUTHENTICATION_IMAGE_URL,
  AUTHENTICATION_SUCCESS_IMAGE_URL,
} from "@web-ui/constants";
import { GovernanceButton, GovernanceTypography } from "@web-ui/components";

enum EOnboardingScreens {
  IDLE = 0,
  MERCHANT_AUTHORIZATION = 1,
  EMPTY_BALANCE = 2,
  FUND_WIDGET = 3,
  BALANCES = 4,
  ONBOARDING_SUCCESS = 5,
}

const OnboardingFlow: React.FC<IOnboardingFlowParams> = (
  props: IOnboardingFlowParams,
) => {
  const {
    gatewayUrl,
    finalSuccessContent = "You are good to go and purchase using your payment token",
    closeCallback = () => {},
    gatewayName,
    excludeCardWrapper,
  } = props;
  const alert = useAlert();
  const { balances } = useBalances();

  const { coreProxy } = useStoreContext();
  const { setLoading, closeModal, handleCoreError } = useLayoutContext();
  const classes = useStyles();

  const [currentSreen, setCurrentSreen] = useState<EOnboardingScreens>(
    EOnboardingScreens.IDLE,
  );

  useEffect(() => {
    setLoading(true);
    // First initialze the gateway
    coreProxy.getAuthorizedGateways().match((gatewaysMap) => {
      if (gatewaysMap.get(gatewayUrl)) {
        //check for balances
        coreProxy.getBalances().match((_balances) => {
          decideScreenWhenGatewayIsAlreadyAuthorized(
            !!_balances.assets?.length,
          );
        }, handleCoreError);
      } else {
        setCurrentSreen(EOnboardingScreens.MERCHANT_AUTHORIZATION);
      }

      setLoading(false);
    }, handleCoreError);

    coreProxy.onGatewayAuthorized.subscribe((_gatewayUrl) => {
      if (gatewayUrl === _gatewayUrl) {
        alert.success(`Gateway ${gatewayUrl} authorization succeeded!`);
        setLoading(false);
        coreProxy.getBalances().match((_balances) => {
          decideScreenWhenGatewayIsAlreadyAuthorized(
            !!_balances.assets?.length,
          );
        }, handleCoreError);
      }
    });

    coreProxy.onAuthorizedGatewayActivationFailed.subscribe((_gatewayUrl) => {
      if (gatewayUrl === _gatewayUrl) {
        alert.error(`Gateway ${gatewayUrl} authorization failed!`);
        setLoading(false);
      }
    });
  }, []);

  // Watch funding success
  useEffect(() => {
    if (balances?.length && currentSreen === EOnboardingScreens.FUND_WIDGET) {
      setCurrentSreen(EOnboardingScreens.BALANCES);
    }
  }, [balances]);

  const decideScreenWhenGatewayIsAlreadyAuthorized = (
    hasBalances?: boolean,
  ) => {
    if (hasBalances || balances?.length) {
      setCurrentSreen(EOnboardingScreens.BALANCES);
    } else {
      setCurrentSreen(EOnboardingScreens.EMPTY_BALANCE);
    }
  };

  const handleGatewayAuthorization = () => {
    setLoading(true);
    coreProxy.authorizeGateway(gatewayUrl).mapErr(handleCoreError);
  };

  const goToFundWalletScreen = () => {
    setCurrentSreen(EOnboardingScreens.FUND_WIDGET);
  };

  const goToSuccessScreen = () => {
    setCurrentSreen(EOnboardingScreens.ONBOARDING_SUCCESS);
  };

  const onOkClick = () => {
    closeCallback();
    closeModal();
  };

  const renderScreen = (): ReactNode => {
    switch (currentSreen) {
      case EOnboardingScreens.IDLE:
        return <>Loading...</>;
      case EOnboardingScreens.MERCHANT_AUTHORIZATION:
        return (
          <>
            {balances?.length ? (
              <BalancesWidget excludeCardWrapper={excludeCardWrapper} />
            ) : (
              <>
                <GovernanceTypography variant="h4">
                  You are getting closer!
                </GovernanceTypography>
                <img
                  className={classes.authenticationImg}
                  src={AUTHENTICATION_IMAGE_URL}
                />
              </>
            )}
            <Box mb={2} width="100%">
              <GovernanceButton
                fullWidth
                color="primary"
                variant="contained"
                onClick={handleGatewayAuthorization}
              >
                {`Approve ${gatewayName || "Hyperpay"}`}
              </GovernanceButton>
            </Box>
          </>
        );
      case EOnboardingScreens.EMPTY_BALANCE:
        return (
          <>
            <Box className={classes.titleWrapper}>
              <GovernanceTypography variant="h4">Success!</GovernanceTypography>
            </Box>
            <Box className={classes.subtitleWrapper}>
              <GovernanceTypography variant="subtitle1">
                You have successfully connected your wallet.
              </GovernanceTypography>
            </Box>
            <img
              className={classes.authenticationSuccessImg}
              src={AUTHENTICATION_SUCCESS_IMAGE_URL}
            />
            <Box mb={2} width="100%">
              <GovernanceButton
                fullWidth
                color="primary"
                variant="contained"
                onClick={goToFundWalletScreen}
              >
                Fund My Wallet
              </GovernanceButton>
            </Box>
          </>
        );
      case EOnboardingScreens.FUND_WIDGET:
        return <FundWidget excludeCardWrapper={excludeCardWrapper} />;
      case EOnboardingScreens.BALANCES:
        return (
          <>
            {balances?.length && (
              <BalancesWidget excludeCardWrapper={excludeCardWrapper} />
            )}

            <Box mb={2} width="100%">
              <GovernanceButton
                fullWidth
                color="primary"
                variant="contained"
                onClick={goToSuccessScreen}
              >
                Done
              </GovernanceButton>
            </Box>

            <GovernanceButton
              fullWidth
              variant="outlined"
              color="default"
              onClick={goToFundWalletScreen}
            >
              Fund My Wallet
            </GovernanceButton>
          </>
        );
      case EOnboardingScreens.ONBOARDING_SUCCESS:
        return (
          <>
            <SucessContent
              label="All good!"
              info={finalSuccessContent}
              onOkay={onOkClick}
            />
            <GovernanceButton
              fullWidth
              variant="outlined"
              color="default"
              onClick={goToFundWalletScreen}
            >
              Fund My Wallet
            </GovernanceButton>
          </>
        );
      default:
        return <Box>Something went wrong!</Box>;
    }
  };

  return (
    <Box className={classes.container}>
      <Box width={480} margin="auto">
        {renderScreen()}
        <ModalFooter />
      </Box>
    </Box>
  );
};

export default OnboardingFlow;
