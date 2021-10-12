import React from "react";
import { Box, Typography } from "@material-ui/core";
import { useStyles } from "@web-ui/components/GovernanceVotingCard/GovernanceVotingCard.style";
import { GovernanceProgress, GovernanceButton } from "@web-ui/components";
import { colors, defaultWidgetUniqueIdentifier } from "@web-ui/theme";

interface GovernanceVotingCardProps {
  type: "for" | "against" | "abstain";
  value: number;
  progressValue: number;
  onVoteClick: () => void;
  isVoted: boolean;
  showVoteButton: boolean;
  disableVoteButton: boolean;
  widgetUniqueIdentifier?: string;
}

const colorConfig = {
  for: colors.GREEN700,
  against: colors.RED700,
  abstain: colors.GRAY500,
};

const titleConfig = {
  for: "For",
  against: "Against",
  abstain: "Abstain",
};

export const GovernanceVotingCard: React.FC<GovernanceVotingCardProps> = (
  props: GovernanceVotingCardProps,
) => {
  const {
    type,
    value,
    progressValue,
    onVoteClick,
    isVoted,
    showVoteButton = true,
    disableVoteButton,
    widgetUniqueIdentifier = defaultWidgetUniqueIdentifier,
  } = props;
  const classes = useStyles({ isVoted });

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.titleWrapper}>
        <Typography className={classes.titleText} variant="h5">
          {titleConfig[type]}
        </Typography>
        <Typography className={classes.valueText} variant="h5">
          {value}
        </Typography>
      </Box>
      <GovernanceProgress
        value={progressValue}
        color={colorConfig[type]}
        widgetUniqueIdentifier={widgetUniqueIdentifier}
      />
      {showVoteButton && (
        <GovernanceButton
          widgetUniqueIdentifier={widgetUniqueIdentifier}
          className={classes.button}
          fullWidth
          color="primary"
          size="small"
          variant={isVoted ? "contained" : "outlined"}
          disabled={disableVoteButton}
          onClick={() => {
            if (!isVoted) {
              onVoteClick();
            }
          }}
        >
          {isVoted ? "Voted!" : "Vote"}
        </GovernanceButton>
      )}
    </Box>
  );
};
