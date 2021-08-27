import React, { useEffect, useState } from "react";
import { Box, Tooltip, IconButton } from "@material-ui/core";
import { IRenderParams } from "@web-ui/interfaces";
import AddIcon from "@material-ui/icons/Add";
import LocalGasStationIcon from "@material-ui/icons/LocalGasStation";
import CheckIcon from "@material-ui/icons/Check";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import Modal from "@web-ui/containers/Modal";
import { useAlert } from "react-alert";
import {
  GatewayUrl,
  GatewayTokenInfo,
  EthereumAddress,
  BigNumberString,
} from "@hypernetlabs/objects";

interface IGatewayInfoModalWidget extends IRenderParams {
  gatewayUrl: GatewayUrl;
  closeCallback: () => void;
}

enum ETokenState {
  NOT_REGISTERED = "NOT_REGISTERED",
  REGISTERED = "REGISTERED",
  REGISTERED_WITH_NO_FUND = "REGISTERED_WITH_NO_FUND",
}

const GatewayInfoModalWidget: React.FC<IGatewayInfoModalWidget> = (
  props: IGatewayInfoModalWidget,
) => {
  const { gatewayUrl, closeCallback } = props;
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [gatewayTokenInfo, setGatewayTokenInfo] = useState<GatewayTokenInfo[]>(
    [],
  );
  const [tokensStateChannelsMap, setTokensStateChannelsMap] = useState<
    Map<EthereumAddress, ETokenState>
  >(new Map());

  useEffect(() => {
    setLoading(true);
    coreProxy
      .getGatewayTokenInfo([gatewayUrl])
      .map((gatewayTokenInfoMap) => {
        const gatewayTokenInfoVal = gatewayTokenInfoMap.get(gatewayUrl);
        if (gatewayTokenInfoVal != null) {
          setGatewayTokenInfo(gatewayTokenInfoVal);
        }
        checkTokensStateChannelsStatus(gatewayTokenInfoVal);
      })
      .mapErr(handleError);
  }, []);

  const checkTokensStateChannelsStatus = (
    _gatewayTokenInfo: GatewayTokenInfo[] = gatewayTokenInfo,
  ) => {
    setLoading(true);
    coreProxy.getBalances().map((balances) => {
      coreProxy
        .getActiveStateChannels()
        .map((activeStateChannels) => {
          const activeRouters = activeStateChannels.map(
            (activeStateChannel) => activeStateChannel.routerPublicIdentifier,
          );
          _gatewayTokenInfo.forEach((tokenInfo) => {
            const allRoutersMatch = tokenInfo.routerPublicIdentifiers.every(
              (routerPublicIdentifier) => {
                return activeRouters.includes(routerPublicIdentifier);
              },
            );
            const fundedTokenAssets = balances.assets
              .filter(
                (assetBalance) =>
                  assetBalance.totalAmount > BigNumberString("0"),
              )
              .map((assetBalance) => {
                return assetBalance.assetAddress;
              });

            const tokenHasFunds = fundedTokenAssets.includes(
              tokenInfo.tokenAddress,
            );
            setTokensStateChannelsMap(
              new Map(
                tokensStateChannelsMap.set(
                  tokenInfo.tokenAddress,
                  allRoutersMatch
                    ? tokenHasFunds
                      ? ETokenState.REGISTERED
                      : ETokenState.REGISTERED_WITH_NO_FUND
                    : ETokenState.NOT_REGISTERED,
                ),
              ),
            );
          });
          setLoading(false);
        })
        .mapErr(handleError);
    });
  };

  const addToken = (gatewayToken: GatewayTokenInfo) => {
    setLoading(true);
    coreProxy
      .createStateChannel(
        gatewayToken.routerPublicIdentifiers,
        gatewayToken.chainId,
      )
      .map((activeStateChannel) => {
        checkTokensStateChannelsStatus();
        alert.success(
          "Your token has been registered and a new account has been created!",
        );
      })
      .mapErr(handleError);
  };

  const addFunds = (gatewayToken: GatewayTokenInfo) => {
    console.log("addFunds gatewayToken: ", gatewayToken);
  };

  const handleError = (err) => {
    alert.error(err.message || "Something went wrong!");
    setLoading(false);
  };

  return (
    <Modal
      closeCallback={closeCallback}
      modalStyle={{
        display: "flex",
        flexDirection: "column",
        width: 570,
        paddingRight: 50,
        paddingLeft: 70,
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        width="100%"
      >
        <Box paddingTop={2} paddingBottom={2}>
          <b>Gateway:</b> {gatewayUrl}
        </Box>
        <Box display="flex" flexDirection="column" width="100%">
          {gatewayTokenInfo.map((gatewayToken) => (
            <Box
              key={gatewayToken.tokenAddress}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box fontSize={16}>
                <b>Token:</b> {gatewayToken.tokenAddress}
              </Box>
              {(tokensStateChannelsMap.get(gatewayToken.tokenAddress) == null ||
                tokensStateChannelsMap.get(gatewayToken.tokenAddress) ===
                  ETokenState.NOT_REGISTERED) && (
                <Tooltip title="Add token" placement="top">
                  <IconButton
                    aria-label="Add token"
                    onClick={() => addToken(gatewayToken)}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              )}

              {tokensStateChannelsMap.get(gatewayToken.tokenAddress) ===
                ETokenState.REGISTERED && (
                <Tooltip title="Token Already Registered" placement="top">
                  <IconButton
                    aria-label="Registered token"
                    style={{ cursor: "auto" }}
                  >
                    <CheckIcon color="primary" />
                  </IconButton>
                </Tooltip>
              )}

              {tokensStateChannelsMap.get(gatewayToken.tokenAddress) ===
                ETokenState.REGISTERED_WITH_NO_FUND && (
                <Box display="flex">
                  <Tooltip title="Token Already Registered" placement="top">
                    <IconButton
                      aria-label="Registered token"
                      style={{ cursor: "auto", paddingRight: 5 }}
                    >
                      <CheckIcon color="primary" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Fund Your Account" placement="top">
                    <IconButton
                      aria-label="Fund your account"
                      onClick={() => addFunds(gatewayToken)}
                    >
                      <LocalGasStationIcon color="secondary" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Modal>
  );
};

export default GatewayInfoModalWidget;
