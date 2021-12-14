import React, { useMemo } from "react";
import { Box, Typography } from "@material-ui/core";

import {
  EthereumContractAddress,
  TokenInformation,
} from "@hypernetlabs/objects";
import { useStyles } from "@web-ui/components/GovernancePaymentTokenCell/GovernancePaymentTokenCell.style";

interface GovernancePaymentTokenCellProps {
  paymentTokenAddress: EthereumContractAddress;
  tokenInformationList: TokenInformation[];
}

export const GovernancePaymentTokenCell: React.FC<GovernancePaymentTokenCellProps> =
  (props: GovernancePaymentTokenCellProps) => {
    const { paymentTokenAddress, tokenInformationList } = props;
    const classes = useStyles();

    const tokenInformation = useMemo(
      () =>
        tokenInformationList.find(
          (tokenInformation) =>
            tokenInformation.address === paymentTokenAddress,
        ),
      [],
    );

    if (!tokenInformation) {
      return <>{paymentTokenAddress}</>;
    }

    return (
      <Box display="flex" alignItems="center">
        <img src={tokenInformation.logoUrl} className={classes.tokenLogo} />
        <Typography variant="body1">{tokenInformation.name}</Typography>
      </Box>
    );
  };
