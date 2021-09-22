import { makeStyles } from "@material-ui/core";
import { colors } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  wrapper: (props: any) => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
  }),
  title: {
    marginBottom: 4,
    color: colors.GRAY500,
  },
  value: {
    marginBottom: 16,
  },
}));
