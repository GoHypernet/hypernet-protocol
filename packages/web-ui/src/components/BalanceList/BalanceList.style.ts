import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  container: {
    width: "100%",
    borderRadius: 4,
  },
  itemWrapper: {
    padding: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemBorderBottom: {
    borderBottom: "1px solid #F2F2F2",
  },
  itemBorder: {
    border: "1px solid #F2F2F2",
  },
  tokenLogo: {
    width: 30,
  },
  tokenAmount: {
    fontSize: 34,
  },
  tokenName: {
    fontSize: 16,
    opacity: 0.3,
  },
});
