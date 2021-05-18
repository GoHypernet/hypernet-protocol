import { createUseStyles } from "react-jss";

import { colors } from "@user-dashboard/theme";

const useStyles = createUseStyles({
  "@global": {
    body: {
      margin: 0,
      backgroundColor: colors.BACKGROUND_GREY,
      color: colors.MAIN_TEXT_BLACK,
      fontFamily:
        '"Montserrat", "Roboto", "Helvetica Neue", "Arial", sans-serif',
    },
  },
  appWrapper: {
    margin: 0,
  },
});

export default useStyles;
