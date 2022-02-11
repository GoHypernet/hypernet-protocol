import { makeStyles } from "@material-ui/core";
import { colors, EFontSize } from "@web-ui/theme";

export const useStyles = makeStyles({
  container: {
    margin: "auto",
  },
  linkButton: {
    color: colors.BLUE300,
    fontSize: EFontSize.BUTTON_SMALL,
  },
});
