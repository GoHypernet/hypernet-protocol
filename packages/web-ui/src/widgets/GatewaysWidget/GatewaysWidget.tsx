import React, { useState, useEffect } from "react";

import { Box, Avatar, Tooltip, Typography } from "@material-ui/core";
import { Folder as FolderIcon, Block as BlockIcon } from "@material-ui/icons";
import { Form, Formik } from "formik";

import { GatewayRegistrationInfo, GatewayUrl } from "@hypernetlabs/objects";
import {
  GovernanceEmptyState,
  GovernanceButton,
  GovernanceCard,
  List,
  ListItem,
  GovernanceDialogSelectField,
} from "@web-ui/components";
import GatewayInfoModalWidget from "@web-ui/widgets/GatewayInfoModalWidget";
import GatewayDeauthorizationModalWidget from "@web-ui/widgets/GatewayDeauthorizationModalWidget";
import { useGateways } from "@web-ui/hooks";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { IRenderParams } from "@web-ui/interfaces";
import { useStyles } from "@web-ui/widgets/GatewaysWidget/GatewaysWidget.style";
import { HYPERPAY_LOGO_URL } from "@web-ui/constants";

interface IGatewaysWidget extends IRenderParams {}

const GatewaysWidget: React.FC<IGatewaysWidget> = ({
  noLabel,
}: IGatewaysWidget) => {
  const { gatewaysMap, openGatewayIFrame, authorizeGateway, loading } =
    useGateways();
  const classes = useStyles();

  const { setLoading, handleCoreError } = useLayoutContext();
  const { coreProxy } = useStoreContext();
  const [gateways, setGateways] = useState<GatewayRegistrationInfo[]>([]);

  useEffect(() => {
    getGateways();
  }, []);

  const getGateways = () => {
    setLoading(true);
    coreProxy
      .getGatewayEntryList()
      .map((gatewayMap) => {
        const gateways = [...gatewayMap.values()];
        setGateways(gateways);
        setLoading(false);
      })
      .mapErr(handleCoreError);
  };

  const [selectedGatewayUrl, setSelectedGatewayUrl] = useState<GatewayUrl>(
    GatewayUrl(""),
  );
  const [selectedDeauthorizedGatewayUrl, setSelectedDeauthorizedGatewayUrl] =
    useState<GatewayUrl>(GatewayUrl(""));

  const openGatewayDetailsModal = (gatewayUrl) => {
    setSelectedGatewayUrl(gatewayUrl);
  };

  const openGatewayDeauthorizationModal = (gatewayUrl) => {
    setSelectedDeauthorizedGatewayUrl(gatewayUrl);
  };

  const gatewayModalcloseCallback = () => {
    setSelectedGatewayUrl(GatewayUrl(""));
  };

  const gatewayDeauthorizationModalcloseCallback = () => {
    setSelectedDeauthorizedGatewayUrl(GatewayUrl(""));
  };

  const hasEmptyState = [...gatewaysMap.keys()].length === 0 && !loading;

  return (
    <GovernanceCard
      className=""
      title={!noLabel ? "Your Gateways" : undefined}
      description={
        !noLabel
          ? "Payment processing gateways you have authorized for your Hypernet accounts."
          : undefined
      }
    >
      {hasEmptyState ? (
        <GovernanceEmptyState
          title="No results!"
          description="You don't have any authorized gateways yet."
        />
      ) : (
        <>
          {selectedGatewayUrl && (
            <GatewayInfoModalWidget
              gatewayUrl={selectedGatewayUrl}
              closeCallback={gatewayModalcloseCallback}
            />
          )}
          {selectedDeauthorizedGatewayUrl && (
            <GatewayDeauthorizationModalWidget
              gatewayUrl={selectedDeauthorizedGatewayUrl}
              closeCallback={gatewayDeauthorizationModalcloseCallback}
            />
          )}
          <List>
            {[...gatewaysMap.keys()].map((gatewayUrl, index) => (
              <ListItem
                key={index}
                icon={
                  <Tooltip
                    title={
                      gatewaysMap.get(gatewayUrl)
                        ? "View gateway application"
                        : "Gateway is inactive"
                    }
                    placement="top"
                  >
                    <Avatar
                      className={classes.icon}
                      style={{
                        cursor: gatewaysMap.get(gatewayUrl)
                          ? "pointer"
                          : "auto",
                      }}
                      onClick={() => {
                        gatewaysMap.get(gatewayUrl) &&
                          openGatewayIFrame(gatewayUrl);
                      }}
                      {...(gatewayUrl.includes("hyperpay") && {
                        src: HYPERPAY_LOGO_URL,
                      })}
                    >
                      {gatewaysMap.get(gatewayUrl) ? (
                        <FolderIcon />
                      ) : (
                        <BlockIcon />
                      )}
                    </Avatar>
                  </Tooltip>
                }
                title={
                  <Box>
                    <Tooltip
                      title={gatewayUrl}
                      disableHoverListener={gatewayUrl.length <= 60}
                      placement="top"
                    >
                      <Typography variant="body2">
                        {gatewayUrl.length > 60
                          ? `${gatewayUrl.substr(0, 60)}...`
                          : gatewayUrl}
                      </Typography>
                    </Tooltip>
                  </Box>
                }
                rightContent={
                  <>
                    <GovernanceButton
                      size="small"
                      variant="text"
                      onClick={() => {
                        openGatewayDetailsModal(gatewayUrl);
                      }}
                    >
                      Details
                    </GovernanceButton>

                    <GovernanceButton
                      size="small"
                      variant="text"
                      onClick={() => {
                        openGatewayDeauthorizationModal(gatewayUrl);
                      }}
                    >
                      Deauthorize
                    </GovernanceButton>
                  </>
                }
              />
            ))}
          </List>
        </>
      )}
      <Formik
        initialValues={{ gateway: "" }}
        enableReinitialize
        onSubmit={(values, { resetForm }) => {
          if (values?.gateway) {
            authorizeGateway(GatewayUrl(values.gateway), resetForm);
          }
        }}
      >
        {({ values, handleSubmit, setFieldValue }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <GovernanceDialogSelectField
                required
                dialogTitle="Select a Gateway"
                name="gateway"
                type="select"
                options={gateways.map(({ url }) => ({
                  primaryText: url,
                  value: url,
                }))}
                fullWidth
                handleChange={(gateway: GatewayUrl) => {
                  setFieldValue("gateway", gateway);
                }}
              />
              <GovernanceButton
                fullWidth
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                disabled={!values?.gateway}
              >
                Authorize
              </GovernanceButton>
            </Form>
          );
        }}
      </Formik>
    </GovernanceCard>
  );
};

export default GatewaysWidget;
