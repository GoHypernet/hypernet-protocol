import { useLayoutContext, useStoreContext } from "@web-ui/contexts";
import React, { useEffect, useState } from "react";

import { GovernanceButton, GovernanceTypography } from "@web-ui/components";

import { IRenderParams } from "@web-ui/interfaces";
import { Box } from "@material-ui/core";
import { ProviderId } from "@hypernetlabs/objects";
import {
  METAMASK_LOGO_IMAGE_URL,
  WALLET_CONNECT_LOGO_IMAGE_URL,
} from "@web-ui/constants";
import { useStyles } from "@web-ui/widgets/WalletConnectWidget/WalletConnectWidget.style";

import OptionCard from "./OptionCard";
export interface IProvider {
  id: string;
  name: string;
  logo: string;
  description?: string;
  mobileVisible?: boolean;
}

export const METAMASK: IProvider = {
  id: "injected",
  name: "Metamask",
  logo: METAMASK_LOGO_IMAGE_URL,
  mobileVisible: false,
};

export const WALLETCONNECT: IProvider = {
  id: "walletconnect",
  name: "WalletConnect",
  logo: WALLET_CONNECT_LOGO_IMAGE_URL,
  mobileVisible: true,
};

export const WALLET_PROVIDERS: Array<IProvider> = [METAMASK, WALLETCONNECT];

interface IWalletConnectWidget extends IRenderParams {}

const WalletConnectWidget: React.FC<IWalletConnectWidget> = (
  props: IWalletConnectWidget,
) => {
  const classes = useStyles();
  const { coreProxy } = useStoreContext();
  const { closeModal, setModalHeader } = useLayoutContext();

  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [selectedWalletOption, setSelectedWalletOption] =
    useState<IProvider>(METAMASK);

  useEffect(() => {
    setModalHeader("Wallet Option");

    return () => {
      setModalHeader("");
    };
  }, []);

  const handleSubmit = () => {
    const { id } = selectedWalletOption;
    coreProxy.provideProviderId(ProviderId(id)).match(
      () => {
        closeModal();
      },
      (err) => {
        console.error(err.message || "Err while providePrivateCredentials.");
      },
    );
  };

  const getFilteredProviders = () => {
    if (isMobile) {
      return WALLET_PROVIDERS.filter((i) => i.mobileVisible);
    }
    return WALLET_PROVIDERS;
  };

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.titleWrapper}>
        <GovernanceTypography variant="h4">
          Please select a wallet to connect.
        </GovernanceTypography>
      </Box>
      {/* <Box className={classes.titleWrapper}>
        <GovernanceTypography variant="h4">
          Wallet options!
        </GovernanceTypography>
      </Box>
      <Box className={classes.subtitleWrapper}>
        <GovernanceTypography variant="subtitle1">
          Please select a wallet to connect.
        </GovernanceTypography>
      </Box> */}
      {getFilteredProviders().map((provider: IProvider) => (
        <OptionCard
          key={provider.id}
          label={provider.name}
          iconComponent={
            <img width="100%" src={provider.logo} alt={provider.name} />
          }
          onClick={() => {
            setSelectedWalletOption(provider);
          }}
          style={{ borderRadius: 3, padding: 10, marginBottom: 24 }}
          selected={selectedWalletOption.id === provider.id}
        />
      ))}
      <Box className={classes.buttonWrapper}>
        <GovernanceButton
          color="primary"
          variant="contained"
          size="medium"
          fullWidth
          onClick={() => {
            handleSubmit();
          }}
        >
          Connect
        </GovernanceButton>
      </Box>
    </Box>
  );
};

export default WalletConnectWidget;
