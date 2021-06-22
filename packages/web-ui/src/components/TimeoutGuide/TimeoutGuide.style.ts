import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    margin: 20,
    textAlign: "left",
  },
  title: {
    margin: "20px 0",
  },
  linkWrapper: { display: "flex", flexDirection: "column", margin: "20px 0" },
});
