import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  wrapper: {},
  balancesWrapper: {
    // margin: "24px 0",
  },
  balancesLabel: {
    // fontSize: 20,
    // marginBottom: 24,
    // textAlign: "center",
  },
  alertMessage: {
    color: (props: any) => (props.error ? "red" : "black"),
  },
});
