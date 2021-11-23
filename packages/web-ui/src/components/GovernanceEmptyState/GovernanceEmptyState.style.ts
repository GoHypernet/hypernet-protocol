import { makeStyles } from "@material-ui/core";

import { colors, EFontWeight } from "@web-ui/theme";

export const useStyles = makeStyles(() => ({
  wrapper: {
    padding: 24,
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    maxWidth: 480,
  },
  title: {
    fontWeight: EFontWeight.BOLD,
    marginTop: 16,
    marginBottom: 8,
  },
  description: {},
}));
