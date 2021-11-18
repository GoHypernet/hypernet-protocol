import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  container: {
    width: "100%",
    padding: "30px 0"
  },
  emptyBalanceScreenWrapper: {},
  paymentTokenLabel: {
    textAlign: "left",
    paddingTop: 25,
  },
  balancesEmptyLabel: {
    fontSize: 20,
    marginTop: 25,
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
  authenticationImg: {
    maxWidth: 280,
    padding: "40px 0",
  },
  authenticationSuccessImg: {
    maxWidth: 280,
    padding: "40px 0",
  },
  doneButtonWrapper: { width: "100%", marginBottom: "16px" },
});
