import { makeStyles } from "@material-ui/core";
import { colors } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  button: (any) => ({
    padding: "12px 16px",
    backgroundColor: colors.GRAY150,
    marginBottom: 20,
    "&:hover": {
      backgroundColor: colors.PURPLE100,
    },
  }),
  number: {
    color: colors.GRAY500,
  },
  title: (any) => ({
    marginLeft: 40,
  }),
  status: (any) => ({
    marginLeft: "auto",
  }),
  activePulse: {
    width: 16,
    height: 16,
    backgroundColor: colors.PURPLE400,
    marginLeft: 36,
  },
}));
