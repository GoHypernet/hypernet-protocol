import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  loadingWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1299,
  },
});
