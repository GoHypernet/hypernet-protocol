import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  loadingWrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    position: "fixed",
    zIndex: 10001,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
