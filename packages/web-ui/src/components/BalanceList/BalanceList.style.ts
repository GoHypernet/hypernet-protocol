import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    width: "100%",
    border: "1px solid #F2F2F2",
    borderRadius: 4,
  },
  itemWrapper: {
    padding: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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

export default useStyles;
