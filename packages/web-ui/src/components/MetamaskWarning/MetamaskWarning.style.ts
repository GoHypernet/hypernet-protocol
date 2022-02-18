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
  metamaskImgWrapper: {
    marginTop: 24,
    marginBottom: 40,
  },
  metamaskImg: {
    maxWidth: 200,
  },
  continueButton: {
    marginBottom: 16,
  },
});
