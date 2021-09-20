import React from "react";
import { Box, Typography } from "@material-ui/core";

import { colors } from "@web-ui/theme";
import { useStyles } from "@web-ui/components/GovernanceStatusTag/GovernanceStatusTag.style";
import { EProposalState } from "@hypernetlabs/objects";

interface GovernanceStatusTagProps {
  status: EProposalState;
}

export const GovernanceStatusTag: React.FC<GovernanceStatusTagProps> = (
  props: GovernanceStatusTagProps,
) => {
  const { status } = props;
  const config = getStatusConfig(status);
  const classes = useStyles({ config });

  return (
    <Box className={classes.wrapper}>
      <Typography className={classes.text} variant="button">
        {config.text}
      </Typography>
    </Box>
  );
};

export interface IStatusConfig {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  text: string;
}

const getStatusConfig = (status: EProposalState): IStatusConfig => {
  switch (Number(status)) {
    case EProposalState.PENDING:
      return {
        backgroundColor: colors.BLUE100,
        borderColor: colors.BLUE200,
        textColor: colors.BLUE700,
        text: "Pending",
      };
    case EProposalState.ACTIVE:
      return {
        backgroundColor: colors.PURPLE100,
        borderColor: colors.PURPLE200,
        textColor: colors.PURPLE700,
        text: "Active",
      };
    case EProposalState.SUCCEEDED:
      return {
        backgroundColor: colors.BLUE100,
        borderColor: colors.BLUE200,
        textColor: colors.BLUE700,
        text: "Succeeded",
      };
    case EProposalState.EXECUTED:
      return {
        backgroundColor: colors.GREEN100,
        borderColor: colors.GREEN200,
        textColor: colors.GREEN700,
        text: "Executed",
      };
    case EProposalState.DEFEATED:
      return {
        backgroundColor: colors.RED100,
        borderColor: colors.RED200,
        textColor: colors.RED700,
        text: "Defeated",
      };
    case EProposalState.QUEUED:
      return {
        backgroundColor: colors.GRAY100,
        borderColor: colors.GRAY200,
        textColor: colors.GRAY700,
        text: "Queued",
      };
    case EProposalState.CANCELED:
      return {
        backgroundColor: colors.GRAY100,
        borderColor: colors.GRAY200,
        textColor: colors.GRAY700,
        text: "Cancelled",
      };
    case EProposalState.EXPIRED:
      return {
        backgroundColor: colors.GRAY100,
        borderColor: colors.GRAY200,
        textColor: colors.GRAY700,
        text: "Expired",
      };
    default:
      return {
        backgroundColor: colors.GRAY100,
        borderColor: colors.GRAY200,
        textColor: colors.GRAY700,
        text: "Undetermined",
      };
  }
};
