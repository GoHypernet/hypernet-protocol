import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  container: {
    width: "100%",
    padding: "0 10px",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "30px 20px",
  },
  title: {
    marginBottom: 25,
    fontSize: 19,
  },
  metamaskImgWrapper: {
    width: "100%",
    marginBottom: 25,
  },
  metamaskImg: {
    maxWidth: 200,
  },
});
