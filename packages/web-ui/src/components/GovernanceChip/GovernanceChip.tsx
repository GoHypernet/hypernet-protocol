import React from "react";
import { Chip, ChipProps } from "@material-ui/core";

import { useStyles } from "@web-ui/components/GovernanceChip/GovernanceChip.style";
import { colors } from "@web-ui/theme";

type ChipPropsExtacted = Omit<ChipProps, "color">;

export type ChipColorTypes = "blue" | "gray" | "green" | "orange";

export interface GovernanceChipProps extends ChipPropsExtacted {
  color?: ChipColorTypes;
}

export const GovernanceChip: React.FC<GovernanceChipProps> = (
  props: GovernanceChipProps,
) => {
  const { label, color = "gray", className, ...rest } = props;
  const colorCodes = getChipColorCodes(color);
  const classes = useStyles(colorCodes);

  return (
    <Chip className={`${classes.chip} ${className}`} label={label} {...rest} />
  );
};

const getChipColorCodes = (type: ChipColorTypes) => {
  switch (type) {
    case "blue":
      return {
        backgroundColor: colors.BLUE100,
        color: colors.BLUE700,
      };
    case "green":
      return {
        backgroundColor: colors.GREEN100,
        color: colors.GREEN700,
      };
    case "orange":
      return {
        backgroundColor: colors.ORANGE100,
        color: colors.ORANGE700,
      };
    case "gray":
      return {
        backgroundColor: colors.GRAY200,
        color: colors.GRAY500,
      };
  }
};
