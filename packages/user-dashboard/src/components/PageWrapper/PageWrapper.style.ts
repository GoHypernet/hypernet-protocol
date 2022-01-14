import { EFontSize, EFontWeight } from "@hypernetlabs/web-ui";
import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  wrapper: {
    padding: "40px 24px",
    maxWidth: 1280,
    margin: "0 auto",
    flex: 1,
  },
  label: {
    fontWeight: EFontWeight.BOLD,
    fontSize: EFontSize.H1,
    marginBottom: 30,
  },
});
