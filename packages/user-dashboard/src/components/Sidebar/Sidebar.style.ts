import { colors } from "@hypernetlabs/web-ui";
import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  box: {
    width: 240,
    height: "100%",
    top: 55,
    position: "sticky",
    padding: "40px 24px",
    backgroundColor: colors.WHITE,
  },
  paper: {
    position: "sticky",
    borderRight: "none",
  },
  list: {
    padding: 0,
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
});
