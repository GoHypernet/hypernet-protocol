import { useStoreContext } from "@web-ui/contexts";
import React, { useState } from "react";

import { GovernanceButton } from "@web-ui/components";
import { IRenderParams } from "@web-ui/interfaces";

import { Box, Link, Typography } from "@material-ui/core";
import { ProviderId } from "@hypernetlabs/objects";
import OptionCard from "./OptionCard";

export const METAMASK_DOWNLOAD_URL = "https://metamask.io/download.html";
export const METAMASK_LOGO_IMAGE_URL =
  "https://storage.googleapis.com/hypernetlabs-public-assets/hyper-kyc/identity-creation/metamask.svg";
export const WALLET_CONNECT_LOGO_IMAGE_URL =
  "https://storage.googleapis.com/hypernetlabs-public-assets/hyper-kyc/identity-creation/wallet-connect.svg";
export const WALLET_CONNECTION_SUCCESS_IMAGE_URL =
  "https://storage.googleapis.com/hypernetlabs-public-assets/hyper-kyc/identity-creation/success.png";

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
  const { coreProxy } = useStoreContext();

  const [isMobile, setIsMobile] = useState<boolean>(false);

  const [selectedWalletOption, setSelectedWalletOption] =
    useState<IProvider>(METAMASK);

  const handleSubmit = () => {
    const { id } = selectedWalletOption;
    coreProxy.provideProviderId(ProviderId(id));
  };

  const getFilteredProviders = () => {
    if (isMobile) {
      return WALLET_PROVIDERS.filter((i) => i.mobileVisible);
    }
    return WALLET_PROVIDERS;
  };

  const openInstallWalletProviderModal = () => {
    const { name, logo } = selectedWalletOption;

    /*
		setModalState({
			selector: EModalSelector.INSTALL_WALLET_PROVIDER_MODAL,
			customProps: {
				title: `Install ${name}`,
				logo,
				providerName: name,
			},
		});
    */
  };

  return (
    <Box display="flex" flexDirection="column">
      <Typography>Provider Options</Typography>
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
      <GovernanceButton
        color="primary"
        variant="contained"
        onClick={() => {
          handleSubmit();
        }}
      >
        Login
      </GovernanceButton>
      {!isMobile && (
        <Typography>
          {`Don't have a wallet? `}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => openInstallWalletProviderModal()}
          >
            Download here
          </Link>
        </Typography>
      )}
    </Box>
  );
};

export default WalletConnectWidget;
