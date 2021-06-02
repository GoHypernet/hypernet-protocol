import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  container: {
    width: "100%",
  },
  header: {
    borderBottom: "2px solid #F2F2F2",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  connectorName: {
    fontSize: 24,
    paddingLeft: 5,
  },
});
