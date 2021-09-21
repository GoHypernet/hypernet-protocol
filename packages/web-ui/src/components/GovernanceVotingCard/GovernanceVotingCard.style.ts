import { makeStyles } from "@material-ui/core";
import { colors } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: 16,
    backgroundColor: colors.GRAY100,
    border: `1px solid ${colors.GRAY200}`,
    borderRadius: 3,
    width: "100%",
  },
  titleWrapper: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  titleText: {
    color: colors.GRAY700,
  },
  valueText: {
    color: colors.GRAY400,
  },

  button: (props: { isVoted: boolean }) => ({
    marginTop: 40,
    ...(props.isVoted && { cursor: "default" }),

    "&:hover": {
      ...(props.isVoted && { backgroundColor: colors.PURPLE400 }),
    },
  }),
}));
