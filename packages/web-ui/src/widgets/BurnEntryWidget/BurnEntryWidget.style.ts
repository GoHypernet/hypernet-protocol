import { makeStyles } from "@material-ui/core";

import { colors } from "@web-ui/theme";

export const useStyles = makeStyles({
  wrapper: {
    height: 200,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    width: "99%",
  },
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 40,
  },
  burnButton: {
    marginLeft: 16,
    backgroundColor: colors.RED700,
  },
});
