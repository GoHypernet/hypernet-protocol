import { makeStyles } from "@material-ui/core";
import { colors, EFontWeight } from "@web-ui/theme";

export const useStyles = makeStyles({
  subtitle: {
    fontWeight: EFontWeight.REGULAR,
    marginBottom: 24,
  },
  successButton: {
    marginTop: 40,
    marginBottom: 16,
    width: "100%",
  },
  fundButton: {
    marginBottom: 16,
  },
  balanceListContainer: {
    backgroundColor: colors.GRAY150,
    padding: 16,
  },
});
