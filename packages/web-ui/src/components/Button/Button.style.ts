import { makeStyles } from "@material-ui/core";

import { colors, getColorFromStatus, EStatusColor } from "../../theme";

export const useStyles = makeStyles({
  button: {
    color: colors.WHITE,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
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
  secondaryButton: {
    background: "none",
    color: colors.BLACK,
    border: "1px solid #6716FF",
  },
  materialUIButtonWrapper: {
    display: "flex",
    justifyContent: "center",
    padding: "35px 0 20px 0",
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
  linkWrapper: {
    marginTop: 25,
    fontSize: 15,
  },
  link: {
    color: "#2539DEDE",
    cursor: "pointer",
  },
});
