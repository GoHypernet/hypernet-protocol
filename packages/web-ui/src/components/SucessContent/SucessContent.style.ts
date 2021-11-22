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
    color: "black",
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  info: {
    color: "black",
    fontSize: 20,
  },
  authenticationSuccessImg: {
    maxWidth: 280,
    padding: "40px 0",
  },
  buttonWrapper: {
    width: "100%",
    marginBottom: "16px",
  },
  titleWrapper: {
    marginBottom: 24,
  },
  subtitleWrapper: {
    marginBottom: 16,
  },
});
