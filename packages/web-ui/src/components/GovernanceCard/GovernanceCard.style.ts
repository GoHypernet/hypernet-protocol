import { makeStyles } from "@material-ui/core";
import { colors } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: 16,
    borderRadius: 3,
    border: `1px solid ${colors.GRAY200}`,
    backgroundColor: colors.GRAY100,
  },
}));
