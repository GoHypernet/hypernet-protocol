import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  successImage: {
    width: 120,
    margin: 25,
  },
  textWrapper: {
    display: "flex",
    flexDirection: "column",
    marginTop: 15,
  },
  label: {
    color: "#6D6D6D",
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  info: {
    color: "#8a8a8a",
    fontSize: 18,
  },
});

export default useStyles;
