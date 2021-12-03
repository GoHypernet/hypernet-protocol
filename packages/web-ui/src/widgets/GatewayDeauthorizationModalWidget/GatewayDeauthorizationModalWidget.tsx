import { GatewayUrl } from "@hypernetlabs/objects";
import { Box, Typography } from "@material-ui/core";
import { IRenderParams } from "@web-ui/interfaces";
import React from "react";
import { useGateways } from "@web-ui/hooks";
import { colors } from "@web-ui/theme";
import { GovernanceButton, GovernanceDialog } from "@web-ui/components";

interface IGatewayDeauthorizationModalWidget extends IRenderParams {
  gatewayUrl: GatewayUrl;
  closeCallback: () => void;
}

const GatewayDeauthorizationModalWidget: React.FC<IGatewayDeauthorizationModalWidget> =
  ({ gatewayUrl, closeCallback }: IGatewayDeauthorizationModalWidget) => {
    const { deauthorizeGateway } = useGateways();

    const deauthorizeGatewayConfirmed = () => {
      deauthorizeGateway(gatewayUrl);
      closeCallback();
    };

    return (
      <GovernanceDialog
        title={<Typography variant="h4">Gateway Deauthorization</Typography>}
        isOpen={true}
        onClose={closeCallback}
        content={
          <Box display="flex" flexDirection="column">
            <Typography>Would you like to deauthorize ${gatewayUrl}</Typography>
            <Box marginTop={3} display="flex" justifyContent="flex-end">
              <GovernanceButton
                color="default"
                onClick={closeCallback}
                variant="outlined"
                size="small"
              >
                Cancel
              </GovernanceButton>

              <GovernanceButton
                onClick={deauthorizeGatewayConfirmed}
                variant="contained"
                color="secondary"
                size="small"
                style={{ backgroundColor: colors.RED700, marginLeft: 10 }}
              >
                Deauthorize
              </GovernanceButton>
            </Box>
          </Box>
        }
      />
    );
  };

export default GatewayDeauthorizationModalWidget;
