import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  successImage: {
    width: 120,
    margin: 25,
  },
  textWrapper: {
    display: "flex",
    flexDirection: "column",
    marginTop: 15,
  },
  label: {
    color: "#6D6D6D",
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  info: {
    color: "#8a8a8a",
    fontSize: 18,
  },
});
