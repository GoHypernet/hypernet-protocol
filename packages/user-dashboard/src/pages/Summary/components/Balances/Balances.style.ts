import { createUseStyles } from "react-jss";

import { colors } from "@user-dashboard/theme";

const useStyles = createUseStyles({
  wrapper: {
    display: "flex",
    "& > div:first-child": {
      border: "none",
      borderRadius: 0,
    },
  },
});

export default useStyles;
