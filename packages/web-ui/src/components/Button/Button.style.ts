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
    background: (props) =>
      props.bgColor || `${getColorFromStatus(props.status || EStatusColor.PRIMARY)} 0% 0% no-repeat padding-box`,
    width: (props) => (props.fullWidth ? "100%" : "auto"),
  },
});

export default useStyles;
