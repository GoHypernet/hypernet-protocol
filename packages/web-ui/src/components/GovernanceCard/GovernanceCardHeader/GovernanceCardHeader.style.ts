import { makeStyles } from "@material-ui/core";

import { EFontWeight } from "@web-ui/theme";

export const useStyles = makeStyles(() => ({
  wrapper: {},
  header: {
    padding: 16,
  },
  title: {
    fontWeight: EFontWeight.MEDIUM,
  },
  description: {
    marginTop: 8,
  },
}));
