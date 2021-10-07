import { makeStyles } from "@material-ui/core";
import { colors } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    borderRadius: 3,
    border: `1px solid ${colors.GRAY200}`,
    backgroundColor: colors.GRAY100,
  },
  bodyWithHeader: {
    padding: "16px",
  },
  bodyWithoutHeader: {
    padding: 16,
  },
}));
