import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
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
});

export default useStyles;
