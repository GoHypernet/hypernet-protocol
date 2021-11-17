import { makeStyles } from "@material-ui/core";

import { colors } from "@web-ui/theme";

export const useStyles = makeStyles({
  container: {
    width: "100%",
  },
  itemWrapper: {
    padding: "16px 0px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tokenLogo: {
    width: 40,
    marginRight: 32,
  },
  tokenAmount: {
    marginRight: 8,
  },
});
