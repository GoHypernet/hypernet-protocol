import { Box } from "@material-ui/core";
import { useLayoutContext, useStoreContext } from "@web-ui/contexts";
import { IOnboardingFlowParams } from "@web-ui/interfaces";
import React, { useEffect, useState, ReactNode } from "react";
import { useAlert } from "react-alert";

import { ModalFooter } from "@web-ui/components";
import DepositFunds from "@web-ui/flows/OnboardingFlow/screens/DepositFunds";
import EmptyBalance from "@web-ui/flows/OnboardingFlow/screens/EmptyBalance";
import MerchantAuthorization from "@web-ui/flows/OnboardingFlow/screens/MerchantAuthorization";
import OnboardingSuccess from "@web-ui/flows/OnboardingFlow/screens/OnboardingSuccess";

import { useStyles } from "@web-ui/flows/OnboardingFlow/OnboardingFlow.style";
import { useBalances } from "@web-ui/hooks";

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
    successButtonProps,
    gatewayName = "Hypernet.Pay",
    gatewayApprovalContent,
    excludeCardWrapper,
    launchpadUrl,
  } = props;
  const alert = useAlert();
  const { balances } = useBalances();

  const { coreProxy } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();
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
      setCurrentSreen(EOnboardingScreens.ONBOARDING_SUCCESS);
    }
  }, [balances]);

  const decideScreenWhenGatewayIsAlreadyAuthorized = (
    hasBalances?: boolean,
  ) => {
    if (hasBalances || balances?.length) {
      setCurrentSreen(EOnboardingScreens.ONBOARDING_SUCCESS);
    } else {
      setCurrentSreen(EOnboardingScreens.EMPTY_BALANCE);
    }
  };

  const handleGatewayAuthorization = () => {
    setLoading(true);
    coreProxy
      .authorizeGateway(gatewayUrl)
      .map(() => {
        setLoading(false);
        setCurrentSreen(EOnboardingScreens.EMPTY_BALANCE);
      })
      .mapErr(handleCoreError);
  };

  const goToFundWalletScreen = () => {
    setCurrentSreen(EOnboardingScreens.FUND_WIDGET);
  };

  const renderScreen = (): ReactNode => {
    switch (currentSreen) {
      case EOnboardingScreens.IDLE:
        return <>Loading...</>;
      case EOnboardingScreens.MERCHANT_AUTHORIZATION:
        return (
          <MerchantAuthorization
            gatewayName={gatewayName}
            gatewayApprovalContent={gatewayApprovalContent}
            handleGatewayAuthorization={handleGatewayAuthorization}
          />
        );
      case EOnboardingScreens.EMPTY_BALANCE:
        return (
          <EmptyBalance
            gatewayName={gatewayName}
            handleFundButtonClick={goToFundWalletScreen}
          />
        );
      case EOnboardingScreens.FUND_WIDGET:
        return <DepositFunds excludeCardWrapper={!!excludeCardWrapper} />;
      case EOnboardingScreens.ONBOARDING_SUCCESS:
        return (
          <OnboardingSuccess
            gatewayName={gatewayName}
            successButtonProps={successButtonProps}
            handleFundButtonClick={goToFundWalletScreen}
          />
        );
      default:
        return <Box>Something went wrong!</Box>;
    }
  };

  return (
    <Box className={classes.container}>
      <Box width={480} margin="auto">
        {renderScreen()}
        <ModalFooter url={launchpadUrl} />
      </Box>
    </Box>
  );
};

export default OnboardingFlow;
