import { makeStyles } from "@material-ui/core";

import { colors } from "@web-ui/theme";

export const useStyles = makeStyles({
  infoIcon: {
    marginRight: 4,
    color: colors.GRAY500,
  },
  switchLabel: {
    marginRight: 8,
  },
  nakedCard: {
    border: "none",
    backgroundColor: "transparent",
  },
});
