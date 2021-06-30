import {
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Tooltip,
  TextField,
} from "@material-ui/core";
import { Folder, Block } from "@material-ui/icons";
import { IRenderParams } from "@web-ui/interfaces";
import React, { useState, ReactNode } from "react";
import PulseLoader from "react-spinners/PulseLoader";

import { BoxWrapper, EmptyState } from "@web-ui/components";
import { useMerchants } from "@web-ui/hooks";
import { GatewayUrl } from "@hypernetlabs/objects";

interface IMerchantsWidget extends IRenderParams {}

const MerchantsWidget: React.FC<IMerchantsWidget> = ({
  includeBoxWrapper,
  noLabel,
  bodyStyle,
}: IMerchantsWidget) => {
  const {
    merchantsMap,
    openMerchantIFrame,
    deauthorizeMerchant,
    authorizeMerchant,
    loading,
  } = useMerchants();
  const [inputMerchantUrl, setInputMerchantUrl] = useState<GatewayUrl>(
    GatewayUrl(""),
  );

  const renderMerchantAuthorization = (): ReactNode => {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        padding="0px 17px 40px 70px"
      >
        <Box flex={1} paddingRight="50px">
          <TextField
            label="Validator Url"
            value={inputMerchantUrl}
            fullWidth
            onChange={(event) => {
              setInputMerchantUrl(GatewayUrl(event.target.value));
            }}
          />
        </Box>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          disabled={inputMerchantUrl == null || inputMerchantUrl == ""}
          onClick={() => {
            authorizeMerchant(inputMerchantUrl);
            setInputMerchantUrl(GatewayUrl(""));
          }}
        >
          Authorize
        </Button>
      </Box>
    );
  };

  const CustomBox = includeBoxWrapper ? BoxWrapper : Box;

  if (loading) {
    return (
      <CustomBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={150}
      >
        <PulseLoader color={"#b9b9b9"} loading={true} size={25} />
      </CustomBox>
    );
  }

  const hasEmptyState = [...merchantsMap.keys()].length === 0 && !loading;

  return (
    <CustomBox
      label={!noLabel ? "YOUR SERVICES" : undefined}
      bodyStyle={bodyStyle}
      hasEmptyState={hasEmptyState}
      emptyState={
        <Box>
          <EmptyState
            info={<>You don't have any authorized validators yet</>}
          />
          {renderMerchantAuthorization()}
        </Box>
      }
    >
      <List>
        {[...merchantsMap.keys()].map((merchantUrl, index) => (
          <Box key={index}>
            <ListItem>
              <ListItemAvatar>
                <Tooltip
                  title={
                    merchantsMap.get(merchantUrl)
                      ? "View merchant application"
                      : "Merchant is inactive"
                  }
                  placement="top"
                >
                  <Avatar
                    style={{
                      cursor: merchantsMap.get(merchantUrl)
                        ? "pointer"
                        : "auto",
                    }}
                    onClick={() => {
                      merchantsMap.get(merchantUrl) &&
                        openMerchantIFrame(merchantUrl);
                    }}
                  >
                    {merchantsMap.get(merchantUrl) ? <Folder /> : <Block />}
                  </Avatar>
                </Tooltip>
              </ListItemAvatar>
              <ListItemText
                primaryTypographyProps={{
                  color: merchantsMap.get(merchantUrl)
                    ? "textPrimary"
                    : "textSecondary",
                }}
                primary={
                  <Tooltip
                    title={merchantUrl}
                    disableHoverListener={merchantUrl.length <= 36}
                    placement="top"
                  >
                    <Box>
                      {merchantUrl.length > 36
                        ? `${merchantUrl.substr(0, 36)}...`
                        : merchantUrl}
                    </Box>
                  </Tooltip>
                }
              />
              <ListItemSecondaryAction>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => {
                    deauthorizeMerchant(merchantUrl);
                  }}
                >
                  Deauthorize
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="inset" />
          </Box>
        ))}
      </List>
      {renderMerchantAuthorization()}
    </CustomBox>
  );
};

export default MerchantsWidget;
