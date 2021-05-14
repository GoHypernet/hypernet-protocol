import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  loadingWrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    position: "fixed",
    zIndex: 10001,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default useStyles;
