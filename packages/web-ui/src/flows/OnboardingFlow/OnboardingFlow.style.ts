import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  container: {
    width: "100%",
    padding: "0 10px",
  },
  emptyBalanceScreenWrapper: {},
  paymentTokenLabel: {
    textAlign: "left",
    paddingTop: 25,
  },
  balancesEmptyLabel: {
    fontSize: 20,
    margin: 25,
    textAlign: "center",
  },
  preferredTokenWrapper: {
    marginBottom: 25,
  },
  balancesLabel: {
    fontSize: 20,
    marginTop: 24,
    textAlign: "center",
  },
});
