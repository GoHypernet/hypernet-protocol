import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
  },
  upporContent: {
    display: "flex",
    width: "100%",
    marginBottom: 24,
    "& > div:first-child": {
      marginRight: 24,
    },
  },
  bottomContent: {
    marginBottom: 24,
  },
});
