import { makeStyles } from "@material-ui/core";
import { EFontWeight } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginBottom: 24,
  },
  title: {
    fontWeight: EFontWeight.MEDIUM,
  },
  description: {
    marginTop: 8,
  },
}));
