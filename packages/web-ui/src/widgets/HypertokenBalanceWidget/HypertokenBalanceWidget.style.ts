import { makeStyles } from "@material-ui/core";
import { colors } from "@web-ui/theme";

export const useStyles = makeStyles({
  wrapper: {
    padding: 8,
    border: `1px solid ${colors.PURPLE400}`,
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
  },
  logo: {
    height: 20,
    marginLeft: 4,
  },
});
