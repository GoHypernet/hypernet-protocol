import { createUseStyles } from "react-jss";

import { colors } from "@user-dashboard/theme";

const useStyles = createUseStyles({
  wrapper: {
    backgroundColor: colors.WHITE,
    border: `1px solid ${colors.BOX_BORDER_COLOR}`,
    borderRadius: 6,
    boxShadow:
      "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
  },
  label: {
    width: "100%",
    borderBottom: `1px solid ${colors.BOX_BORDER_COLOR}`,
    fontSize: 20,
    padding: 24,
  },
});

export default useStyles;
