import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
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
});

export default useStyles;
