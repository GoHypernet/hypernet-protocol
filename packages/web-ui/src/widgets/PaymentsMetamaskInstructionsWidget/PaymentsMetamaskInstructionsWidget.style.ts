import { makeStyles } from "@material-ui/core";
import { colors, EFontWeight } from "@web-ui/theme";

export const useStyles = makeStyles({
  icon: {
    color: colors.MAIN_TEXT_BLACK,
    fontSize: 24,
  },
  iconContainer: {
    alignSelf: "center",
    width: 48,
    height: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 195, 169, 0.2)",
    borderRadius: "50%",
    marginBottom: 16,
  },
  step: {
    fontWeight: EFontWeight.SEMI_BOLD,
    color: "#AEAEAE",
  },
  description: {
    fontWeight: EFontWeight.MEDIUM,
    marginBottom: 24,
    color: "#6D6D6D",
  },
});
