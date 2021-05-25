import React from "react";
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
} from "@material-ui/core";
import { Folder, Block } from "@material-ui/icons";
import PulseLoader from "react-spinners/PulseLoader";

import { IRenderParams } from "@web-ui/interfaces";
import { useMerchants } from "@web-ui/hooks";
import { BoxWrapper } from "@web-ui/components";

interface IMerchantsWidget extends IRenderParams {}

const MerchantsWidget: React.FC<IMerchantsWidget> = ({
  includeBoxWrapper,
  noLabel,
}: IMerchantsWidget) => {
  const {
    merchantsMap,
    openMerchantIFrame,
    deauthorizeMerchant,
    loading,
  } = useMerchants();

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

  return (
    <CustomBox label={!noLabel ? "YOUR SERVICES" : undefined}>
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
                    disableHoverListener={merchantUrl.length <= 40}
                    placement="top"
                  >
                    <Box>
                      {merchantUrl.length > 40
                        ? `${merchantUrl.substr(0, 40)}...`
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
            {index !== [...merchantsMap.keys()].length - 1 && (
              <Divider variant="inset" />
            )}
          </Box>
        ))}
      </List>
    </CustomBox>
  );
};

export default MerchantsWidget;
