import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 480,
    margin: "auto",
  },
  titleWrapper: {
    marginBottom: 24,
  },
  subtitleWrapper: {
    marginBottom: 16,
  },
  buttonWrapper: {
    marginTop: 16,
    width: "100%",
  },
});
