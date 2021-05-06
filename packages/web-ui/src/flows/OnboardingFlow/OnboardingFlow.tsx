import React, { useEffect, useState, ReactNode } from "react";
import { useAlert } from "react-alert";

import {
  ModalHeader,
  ModalFooter,
  SucessContent,
  BalanceList,
  Button,
} from "@web-ui/components";
import { useLayoutContext, useStoreContext } from "@web-ui/contexts";
import useStyles from "@web-ui/flows/OnboardingFlow/OnboardingFlow.style";
import { useBalances } from "@web-ui/hooks";
import { IOnboardingFlowParams } from "@web-ui/interfaces";
import { EStatusColor } from "@web-ui/theme";
import BalancesWidget from "@web-ui/widgets/BalancesWidget/BalancesWidget";

enum EOnboardingScreens {
  MERCHANT_AUTHORIZATION = 0,
  PREFERRED_PAYMENT_TOKEN = 1,
  EMPTY_BALANCE = 2,
  FUND_WIDGET = 3,
  SUCCESS = 4,
}

const OnboardingFlow: React.FC<IOnboardingFlowParams> = (
  props: IOnboardingFlowParams,
) => {
  const { merchantUrl } = props;
  const alert = useAlert();
  const { balances } = useBalances();
  const { proxy } = useStoreContext();
  const { setLoading, closeModal } = useLayoutContext();
  const classes = useStyles();

  const [currentSreen, setCurrentSreen] = useState<EOnboardingScreens>(
    EOnboardingScreens.MERCHANT_AUTHORIZATION,
  );

  const decideScreenWhenMerchantIsAlreadyAuthorized = () => {
    if (balances?.length) {
      setCurrentSreen(EOnboardingScreens.PREFERRED_PAYMENT_TOKEN);
    } else {
      setCurrentSreen(EOnboardingScreens.EMPTY_BALANCE);
    }
  };

  useEffect(() => {
    proxy.getAuthorizedMerchants().map((merchantsMap) => {
      if (merchantsMap.get(merchantUrl)) {
        decideScreenWhenMerchantIsAlreadyAuthorized();
      } else {
        setCurrentSreen(EOnboardingScreens.MERCHANT_AUTHORIZATION);
      }
    });

    proxy.onMerchantAuthorized.subscribe((_merchantUrl) => {
      if (merchantUrl === _merchantUrl) {
        alert.success(`Merchant ${merchantUrl} authorization succeeded!`);
        setLoading(false);
        decideScreenWhenMerchantIsAlreadyAuthorized();
      }
    });
  }, []);

  const handleMerchantAuthorization = () => {
    setLoading(true);
    proxy.authorizeMerchant(merchantUrl).mapErr((err) => {
      setLoading(false);
      alert.error(err.message || "Merchant authorization failed!");
    });
  };

  const renderScreen = (): ReactNode => {
    switch (currentSreen) {
      case EOnboardingScreens.MERCHANT_AUTHORIZATION:
        return (
          <>
            {balances?.length ? (
              <BalancesWidget />
            ) : (
              <div className={classes.balancesEmptyLabel}>
                You are one step away!
              </div>
            )}
            <Button
              label="Authorize Merchant"
              onClick={handleMerchantAuthorization}
              fullWidth={true}
              bgColor="linear-gradient(98deg, rgba(0,120,255,1) 0%, rgba(126,0,255,1) 100%)"
            />
          </>
        );
      case EOnboardingScreens.PREFERRED_PAYMENT_TOKEN:
        return <div>PREFERRED_PAYMENT_TOKEN</div>;
      case EOnboardingScreens.EMPTY_BALANCE:
        return <div>EMPTY_BALANCE</div>;
      case EOnboardingScreens.FUND_WIDGET:
        return <div>FUND_WIDGET</div>;
      case EOnboardingScreens.SUCCESS:
        return <div>SUCCESS</div>;
      default:
        return <div>Something went wrong!</div>;
    }
  };

  return (
    <div className={classes.container}>
      <ModalHeader />
      {renderScreen()}
      <ModalFooter />
    </div>
  );
};

export default OnboardingFlow;
