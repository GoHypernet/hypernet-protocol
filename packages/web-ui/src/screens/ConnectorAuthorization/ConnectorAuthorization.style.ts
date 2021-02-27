import { IStylesDictionary } from "../../interfaces";

const styles: IStylesDictionary = {
  container: {
    width: "100%",
  },
  header: {
    borderBottom: "2px solid #F2F2F2",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  connectorName: {
    fontSize: 24,
    paddingLeft: 5,
  },
  closeWrapper: {
    position: "absolute",
    right: 0,
    marginRight: 10,
    cursor: "pointer",
    top: 10,
  },
  balancesWrapper: {
    margin: "24px 0",
  },
  balancesLabel: {
    fontSize: 20,
    marginBottom: 24,
    textAlign: "center",
  },
  account: {
    marginTop: 24,
    fontSize: 15,
  },
  accountLink: {
    color: "#2539DE",
  },
};

export default styles;
