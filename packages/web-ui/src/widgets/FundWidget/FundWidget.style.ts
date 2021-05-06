import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  wrapper: {
    padding: 5,
    width: "100%",
  },
  balancesWrapper: {
    margin: "24px 0",
  },
  balancesLabel: {
    fontSize: 20,
    marginBottom: 24,
    textAlign: "center",
  },
  alertMessage: {
    color: (props: any) => (props.error ? "red" : "black"),
  },
});

export default useStyles;
