import { colors } from "@hypernetlabs/web-ui";
import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  "@global": {
    body: {
      margin: 0,
      backgroundColor: colors.BACKGROUND_GREY,
      color: colors.GRAY700,
      fontFamily: '"Inter", sans-serif',
    },
  },
  appWrapper: {
    margin: 0,
    background: colors.WHITE,
  },
});
