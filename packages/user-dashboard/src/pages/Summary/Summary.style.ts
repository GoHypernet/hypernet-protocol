import { createUseStyles } from "react-jss";

import { colors } from "@user-dashboard/theme";

const useStyles = createUseStyles({
  wrapper: {
    display: "flex",
  },
  leftContent: {
    flex: 2,
    marginRight: 24,
  },
  rightContent: {
    flex: 1,
    "& > div:first-child": {
      marginBottom: 24,
    },
  },
});

export default useStyles;
