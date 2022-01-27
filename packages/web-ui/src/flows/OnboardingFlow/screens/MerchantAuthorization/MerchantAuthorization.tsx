import React, { useEffect } from "react";

import { GovernanceButton, GovernanceTypography } from "@web-ui/components";

import { useLayoutContext } from "@web-ui/contexts";
import { useStyles } from "@web-ui/flows/OnboardingFlow/screens/MerchantAuthorization/MerchantAuthorization.style";

interface IMerchantAuthorizationProps {
  gatewayName: string;
  gatewayApprovalContent?: React.ReactNode;
  handleGatewayAuthorization: () => void;
}

const MerchantAuthorization: React.FC<IMerchantAuthorizationProps> = (
  props: IMerchantAuthorizationProps,
) => {
  const { gatewayName, gatewayApprovalContent, handleGatewayAuthorization } =
    props;
  const { setModalHeader } = useLayoutContext();
  const classes = useStyles();

  useEffect(() => {
    setModalHeader("Deposit Funds");

    return () => {
      setModalHeader("");
    };
  }, []);

  return (
    <>
      {gatewayApprovalContent || (
        <GovernanceTypography variant="subtitle1" align="left">
          {`In order to continue approve ${gatewayName} by providing a signature.`}
        </GovernanceTypography>
      )}
      <GovernanceButton
        className={classes.approveButton}
        color="primary"
        variant="contained"
        fullWidth
        onClick={handleGatewayAuthorization}
      >
        {`Approve ${gatewayName}`}
      </GovernanceButton>
    </>
  );
};

export default MerchantAuthorization;
