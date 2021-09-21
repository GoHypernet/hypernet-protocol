import { makeStyles } from "@material-ui/core";
import { colors } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  wrapper: (props: any) => ({
    width: "100%",
    padding: 16,
    marginBottom: 24,
    backgroundColor: colors.GRAY100,
    border: `2px solid ${colors.GRAY200}`,
    borderRadius: 3,
  }),
  title: {
    marginBottom: 28,
    flex: 1
  },
  value: {
    flex: 1
  },
  rowWrapper: {
    display: "flex",
    justifyContent: "space-between",
  },
  rightContent: {
    marginTop: "auto",
    marginLeft: 24,
  },
  iconButton: {
    padding: 0,
    marginLeft: 8,
  },
}));
