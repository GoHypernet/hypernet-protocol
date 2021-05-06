import React, { useEffect, useState } from "react";

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
  FUND_WIDGET = 2,
  SUCCESS = 3,
}

const OnboardingFlow: React.FC<IOnboardingFlowParams> = (
  props: IOnboardingFlowParams,
) => {
  const { merchantUrl } = props;
  const { balances } = useBalances();
  const { proxy } = useStoreContext();
  const classes = useStyles();

  const [currentSreen, setCurrentSreen] = useState<EOnboardingScreens>(
    EOnboardingScreens.MERCHANT_AUTHORIZATION,
  );

  useEffect(() => {
    /* setLoading(true);
    proxy.getAuthorizedMerchants().map((merchantsMap) => {
      if (merchantsMap.get(merchantUrl)) {
        //renderFundWidget(client.webUIClient);
      } else {
        client.webUIClient.startOnboardingFlow({ merchantUrl: merchantUrl });
      }
      setLoading(false);
    });

    proxy.onMerchantAuthorized.subscribe((_merchantUrl) => {
      if (merchantUrl === _merchantUrl) {
        //renderFundWidget(client.webUIClient);
      }
    }); */
  }, []);

  const handleMerchantAuthorization = () => {};

  return (
    <div className={classes.container}>
      <ModalHeader />
      onboarding
      <ModalFooter />
    </div>
  );
};

export default OnboardingFlow;
