import React from "react";
import { Box, Typography } from "@material-ui/core";

import { colors } from "@web-ui/theme";
import { useStyles } from "@web-ui/components/GovernanceTag/GovernanceTag.style";

export enum ETagColor {
  BLUE,
  PURPLE,
  GREEN,
  GRAY,
  RED,
}

export interface ITagConfig {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

interface GovernanceTagProps {
  text: string;
  color: ETagColor;
}

export const GovernanceTag: React.FC<GovernanceTagProps> = (
  props: GovernanceTagProps,
) => {
  const { text, color } = props;
  const config = getTagConfig(color);
  const classes = useStyles({ config });

  return (
    <Box className={classes.wrapper}>
      <Typography className={classes.text} variant="button">
        {text}
      </Typography>
    </Box>
  );
};

export interface IStatusConfig {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

const getTagConfig = (color: ETagColor): ITagConfig => {
  switch (color) {
    case ETagColor.BLUE:
      return {
        backgroundColor: colors.BLUE100,
        borderColor: colors.BLUE200,
        textColor: colors.BLUE700,
      };
    case ETagColor.PURPLE:
      return {
        backgroundColor: colors.PURPLE100,
        borderColor: colors.PURPLE200,
        textColor: colors.PURPLE700,
      };

    case ETagColor.GREEN:
      return {
        backgroundColor: colors.GREEN100,
        borderColor: colors.GREEN200,
        textColor: colors.GREEN700,
      };
    case ETagColor.RED:
      return {
        backgroundColor: colors.RED100,
        borderColor: colors.RED200,
        textColor: colors.RED700,
      };
    case ETagColor.GRAY:
      return {
        backgroundColor: colors.GRAY100,
        borderColor: colors.GRAY200,
        textColor: colors.GRAY700,
      };
  }
};
