import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  container: {
    display: "flex",
    padding: "70px 20px 70px 50px",
    maxWidth: 600,
  },
  rightWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  textWrapper: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    marginLeft: 25,
    marginBottom: 20,
  },
  label: {
    color: "#6D6D6D",
    fontSize: 18,
    marginBottom: 13,
    fontWeight: "bold",
  },
  info: {
    color: "#BABABA",
    fontSize: 17,
  },
});
