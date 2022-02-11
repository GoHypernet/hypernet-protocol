import React, { useEffect } from "react";

import { GovernanceButton, GovernanceTypography } from "@web-ui/components";

import { useLayoutContext } from "@web-ui/contexts";
import { useStyles } from "@web-ui/flows/OnboardingFlow/screens/MerchantAuthorization/MerchantAuthorization.style";

interface IMerchantAuthorizationProps {
  gatewayName: string;
  renderGatewayApprovalContent?: () => React.ReactNode;
  handleGatewayAuthorization: () => void;
}

const MerchantAuthorization: React.FC<IMerchantAuthorizationProps> = (
  props: IMerchantAuthorizationProps,
) => {
  const {
    gatewayName,
    renderGatewayApprovalContent,
    handleGatewayAuthorization,
  } = props;
  const { setModalHeader, loading } = useLayoutContext();
  const classes = useStyles();

  useEffect(() => {
    setModalHeader("Payment Gateway Approval");

    return () => {
      setModalHeader("");
    };
  }, []);

  return (
    <>
      {renderGatewayApprovalContent ? (
        renderGatewayApprovalContent()
      ) : (
        <GovernanceTypography variant="subtitle1" align="left">
          {`In order to continue approve ${gatewayName} by providing a signature.`}
        </GovernanceTypography>
      )}
      <GovernanceButton
        className={classes.approveButton}
        color="primary"
        variant="contained"
        disabled={loading}
        fullWidth
        onClick={handleGatewayAuthorization}
      >
        {`Approve ${gatewayName} ${loading ? "(loading...)" : ""}`}
      </GovernanceButton>
    </>
  );
};

export default MerchantAuthorization;
