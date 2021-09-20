import { makeStyles } from "@material-ui/core";
import { colors } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  dangerButton: {
    backgroundColor: colors.DANGER_ZONE_BUTTON_BG,
    color: colors.WHITE,
    "&:hover": {
      color: colors.BLACK,
    },
  },
}));
