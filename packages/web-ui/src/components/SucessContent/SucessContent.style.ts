import { IStylesDictionary } from "../../interfaces";

const styles: IStylesDictionary = {
  container: {
    display: "flex",
  },
  rightWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  textWrapper: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    marginLeft: 25,
    marginTop: 17,
    alignItems: "flex-start",
  },
  label: {
    color: "#6D6D6D",
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
  info: {
    color: "#BABABA",
    fontSize: 14,
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    borderRadius: 2,
    backgroundColor: "#00C3A9",
    color: "#ffffff",
    border: "none",
    padding: "10px 28px",
    float: "right",
    cursor: "pointer",
    width: 100,
  },
};

export default styles;
