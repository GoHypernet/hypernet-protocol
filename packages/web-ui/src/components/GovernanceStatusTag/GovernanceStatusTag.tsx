import React from "react";
import { GovernanceTag, ETagColor } from "@web-ui/components/GovernanceTag";
import { EProposalState } from "@hypernetlabs/objects";

interface GovernanceStatusTagProps {
  status: EProposalState;
}

export const GovernanceStatusTag: React.FC<GovernanceStatusTagProps> = (
  props: GovernanceStatusTagProps,
) => {
  const { status } = props;
  const { text, color } = getStatusConfig(status);

  return <GovernanceTag text={text} color={color} />;
};

export interface IStatusConfig {
  color: ETagColor;
  text: string;
}

const getStatusConfig = (status: EProposalState): IStatusConfig => {
  switch (Number(status)) {
    case EProposalState.PENDING:
      return {
        color: ETagColor.BLUE,
        text: "Pending",
      };
    case EProposalState.ACTIVE:
      return {
        color: ETagColor.PURPLE,
        text: "Active",
      };
    case EProposalState.SUCCEEDED:
      return {
        color: ETagColor.BLUE,
        text: "Succeeded",
      };
    case EProposalState.EXECUTED:
      return {
        color: ETagColor.GREEN,
        text: "Executed",
      };
    case EProposalState.DEFEATED:
      return {
        color: ETagColor.RED,
        text: "Defeated",
      };
    case EProposalState.QUEUED:
      return {
        color: ETagColor.GRAY,
        text: "Queued",
      };
    case EProposalState.CANCELED:
      return {
        color: ETagColor.GRAY,
        text: "Cancelled",
      };
    case EProposalState.EXPIRED:
      return {
        color: ETagColor.GRAY,
        text: "Expired",
      };
    default:
      return {
        color: ETagColor.GRAY,
        text: "Undetermined",
      };
  }
};
