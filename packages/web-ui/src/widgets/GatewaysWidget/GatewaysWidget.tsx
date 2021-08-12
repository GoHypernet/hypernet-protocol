import { GatewayUrl } from "@hypernetlabs/objects";
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
import { useGateways } from "@web-ui/hooks";

interface IGatewaysWidget extends IRenderParams {}

const GatewaysWidget: React.FC<IGatewaysWidget> = ({
  includeBoxWrapper,
  noLabel,
  bodyStyle,
}: IGatewaysWidget) => {
  const {
    gatewaysMap,
    openGatewayIFrame,
    deauthorizeGateway,
    authorizeGateway,
    loading,
  } = useGateways();
  const [inputGatewayUrl, setInputGatewayUrl] = useState<GatewayUrl>(
    GatewayUrl(""),
  );

  const renderGatewayAuthorization = (): ReactNode => {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        padding="0px 17px 40px 70px"
      >
        <Box flex={1} paddingRight="50px">
          <TextField
            label="Gateway Url"
            value={inputGatewayUrl}
            fullWidth
            onChange={(event) => {
              setInputGatewayUrl(GatewayUrl(event.target.value));
            }}
          />
        </Box>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          disabled={inputGatewayUrl == null || inputGatewayUrl == ""}
          onClick={() => {
            authorizeGateway(inputGatewayUrl);
            setInputGatewayUrl(GatewayUrl(""));
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

  const hasEmptyState = [...gatewaysMap.keys()].length === 0 && !loading;

  return (
    <CustomBox
      label={!noLabel ? "YOUR SERVICES" : undefined}
      bodyStyle={bodyStyle}
      hasEmptyState={hasEmptyState}
      emptyState={
        <Box>
          <EmptyState info={<>You don't have any authorized gateways yet</>} />
          {renderGatewayAuthorization()}
        </Box>
      }
    >
      <List>
        {[...gatewaysMap.keys()].map((gatewayUrl, index) => (
          <Box key={index}>
            <ListItem>
              <ListItemAvatar>
                <Tooltip
                  title={
                    gatewaysMap.get(gatewayUrl)
                      ? "View gateway application"
                      : "Gateway is inactive"
                  }
                  placement="top"
                >
                  <Avatar
                    style={{
                      cursor: gatewaysMap.get(gatewayUrl) ? "pointer" : "auto",
                    }}
                    onClick={() => {
                      gatewaysMap.get(gatewayUrl) &&
                        openGatewayIFrame(gatewayUrl);
                    }}
                  >
                    {gatewaysMap.get(gatewayUrl) ? <Folder /> : <Block />}
                  </Avatar>
                </Tooltip>
              </ListItemAvatar>
              <ListItemText
                primaryTypographyProps={{
                  color: gatewaysMap.get(gatewayUrl)
                    ? "textPrimary"
                    : "textSecondary",
                }}
                primary={
                  <Tooltip
                    title={gatewayUrl}
                    disableHoverListener={gatewayUrl.length <= 36}
                    placement="top"
                  >
                    <Box>
                      {gatewayUrl.length > 36
                        ? `${gatewayUrl.substr(0, 36)}...`
                        : gatewayUrl}
                    </Box>
                  </Tooltip>
                }
              />
              <ListItemSecondaryAction>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => {
                    deauthorizeGateway(gatewayUrl);
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
      {renderGatewayAuthorization()}
    </CustomBox>
  );
};

export default GatewaysWidget;
