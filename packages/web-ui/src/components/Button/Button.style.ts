import { createUseStyles } from "react-jss";

import { colors, getColorFromStatus, EStatusColor } from "../../theme";

const useStyles = createUseStyles({
  button: {
    color: colors.WHITE,
    textAlign: "center",
    fontSize: 22,
    borderRadius: 26,
    border: "none",
    height: 52,
    cursor: "pointer",
    background: (props: any) =>
      props.bgColor ||
      `${getColorFromStatus(
        props.status || EStatusColor.PRIMARY,
      )} 0% 0% no-repeat padding-box`,
    width: (props) => (props.fullWidth ? "100%" : "auto"),
  },
  materialUIButtonWrapper: {
    display: "flex",
    justifyContent: "center",
    padding: "35px 25px 20px 25px",
  },
  materialUIButton: {
    borderRadius: 2,
    backgroundColor: "#00C3A9",
    color: "#ffffff",
    border: "none",
    padding: "10px 28px",
    float: "right",
    cursor: "pointer",
    fontSize: 18,
    width: (props) => (props.fullWidth ? "100%" : "auto"),
  },
});

export default useStyles;
