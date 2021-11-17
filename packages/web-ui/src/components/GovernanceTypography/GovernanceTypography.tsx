import React from "react";
import { Typography, TypographyProps } from "@material-ui/core";

interface IGovernanceTypography extends TypographyProps {}

export const GovernanceTypography: React.FC<IGovernanceTypography> = ({
  children,
  ...rest
}: IGovernanceTypography) => {
  return <Typography {...rest}>{children}</Typography>;
};
