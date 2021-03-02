import { IStylesDictionary } from "../../interfaces";

const styles: IStylesDictionary = {
  container: {
    width: "100%",
    border: "1px solid #F2F2F2",
    borderRadius: 4,
  },
  itemWrapper: {
    margin: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
};

export default styles;
