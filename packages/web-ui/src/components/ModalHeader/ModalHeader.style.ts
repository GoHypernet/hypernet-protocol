import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  container: {
    width: "100%",
  },
  header: {
    borderBottom: "2px solid #F2F2F2",
    width: "100%",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  hypernet: {
    fontSize: 24,
    paddingLeft: 5,
  },
  protocol: {
    fontSize: 23,
    paddingLeft: 5,
    fontWeight: 300,
    paddingTop: 3,
  },
});
