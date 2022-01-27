import { makeStyles } from "@material-ui/core";
import { EFontWeight } from "@web-ui/theme";

export const useStyles = makeStyles({
  subtitle: {
    fontWeight: EFontWeight.REGULAR,
  },
  authenticationSuccessImg: {
    maxWidth: 280,
    padding: "40px 0",
  },
  fundButton: {
    marginTop: 24,
    marginBottom: 16,
  },
});
