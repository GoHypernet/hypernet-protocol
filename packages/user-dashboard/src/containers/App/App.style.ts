import { makeStyles } from "@material-ui/core";

import { colors } from "@hypernetlabs/web-ui";

export const useStyles = makeStyles({
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
