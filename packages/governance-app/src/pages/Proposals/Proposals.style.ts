import { colors } from "@hypernetlabs/web-ui";
import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    maxWidth: 640,
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
});
