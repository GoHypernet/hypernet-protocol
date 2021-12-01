import {
  GatewayUrl,
  GatewayTokenInfo,
  BigNumberString,
  EthereumContractAddress,
} from "@hypernetlabs/objects";
import { Box, Tooltip, IconButton, Typography } from "@material-ui/core";
import {
  Add as AddIcon,
  LocalGasStation as LocalGasStationIcon,
  Check as CheckIcon,
} from "@material-ui/icons";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { IRenderParams } from "@web-ui/interfaces";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";

import { GovernanceDialog, List, ListItem } from "@web-ui/components";
import { useStyles } from "@web-ui/widgets/GatewayInfoModalWidget/GatewayInfoModalWidget.style";

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
  const classes = useStyles();
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { setLoading, handleCoreError } = useLayoutContext();
  const [gatewayTokenInfo, setGatewayTokenInfo] = useState<GatewayTokenInfo[]>(
    [],
  );
  const [tokensStateChannelsMap, setTokensStateChannelsMap] = useState<
    Map<EthereumContractAddress, ETokenState>
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
      .mapErr(handleCoreError);
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
        .mapErr(handleCoreError);
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
      .mapErr(handleCoreError);
  };

  const addFunds = (gatewayToken: GatewayTokenInfo) => {
    console.log("addFunds gatewayToken: ", gatewayToken);
  };

  return (
    <GovernanceDialog
      title={<Typography variant="h4">{`Gateway: ${gatewayUrl}`}</Typography>}
      isOpen={true}
      onClose={closeCallback}
      content={
        <List style={{ margin: 0 }}>
          {gatewayTokenInfo.map((gatewayToken) => (
            <ListItem
              title={`Token:${gatewayToken.tokenAddress}`}
              disableDivider
              rightContent={
                <>
                  {(tokensStateChannelsMap.get(gatewayToken.tokenAddress) ==
                    null ||
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
                        className={classes.iconButton}
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
                          className={classes.iconButton}
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
                </>
              }
            />
          ))}
        </List>
      }
    />
  );
};

export default GatewayInfoModalWidget;
