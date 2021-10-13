import React, { useState } from "react";

import {
  createStyles,
  Switch,
  SwitchProps,
  withStyles,
} from "@material-ui/core";
import { colors } from "@web-integration/theme";

type MuiSwitchPropsExtacted = Omit<SwitchProps, "onChange">;

export interface GovernanceSwitchProps extends MuiSwitchPropsExtacted {
  initialValue: boolean;
  onChange: (value: boolean) => void;
}

const StyledSwitch = withStyles(() =>
  createStyles({
    root: {
      width: 32,
      height: 16,
      padding: "0px 0px 2px 0px",
      display: "flex",
    },
    switchBase: {
      padding: 2,
      color: colors.GRAY500,
      "&$checked": {
        transform: "translateX(16px)",
        color: colors.WHITE,
        "& + $track": {
          opacity: 1,
          backgroundColor: colors.GREEN700,
          borderColor: colors.GREEN700,
        },
      },
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: "none",
    },
    track: {
      border: `1px solid ${colors.GRAY500}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: colors.WHITE,
    },
    checked: {},
  }),
)(Switch);

export const GovernanceSwitch: React.FC<GovernanceSwitchProps> = (
  props: GovernanceSwitchProps,
) => {
  const { initialValue, onChange } = props;
  const [checked, setChecked] = useState(initialValue);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked: newChecked } = event.target;
    setChecked(newChecked);
    onChange(newChecked);
  };

  return <StyledSwitch {...props} checked={checked} onChange={handleToggle} />;
};
