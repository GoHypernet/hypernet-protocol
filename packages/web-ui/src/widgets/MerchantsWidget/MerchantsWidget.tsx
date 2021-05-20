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

import { useMerchants } from "@web-ui/hooks";

interface IMerchantsWidget {
  noLabel?: boolean;
}

const MerchantsWidget: React.FC<IMerchantsWidget> = ({}: IMerchantsWidget) => {
  const {
    merchantsMap,
    openMerchantIFrame,
    deauthorizeMerchant,
    loading,
  } = useMerchants();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={150}
      >
        <PulseLoader color={"#b9b9b9"} loading={true} size={25} />
      </Box>
    );
  }

  return (
    <Box>
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
    </Box>
  );
};

export default MerchantsWidget;
