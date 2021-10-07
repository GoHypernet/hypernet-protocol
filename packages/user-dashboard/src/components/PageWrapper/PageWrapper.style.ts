import { EFontSize, EFontWeight } from "@hypernetlabs/web-ui";
import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  wrapper: {
    padding: "40px 24px",
    maxWidth: 960,
    margin: "auto",
  },
  label: {
    fontWeight: EFontWeight.BOLD,
    fontSize: EFontSize.H1,
    marginBottom: 30,
  },
});
