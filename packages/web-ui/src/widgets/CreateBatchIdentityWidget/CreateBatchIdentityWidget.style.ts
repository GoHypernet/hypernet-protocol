import { makeStyles } from "@material-ui/core";
import { EFontSize, EFontWeight, colors } from "@web-integration/theme";

export const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    width: "99%",
  },
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    marginLeft: 16,
  },
  switchContainer: {
    width: 225,
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  switchTitle: {
    fontSize: EFontSize.BUTTON_SMALL,
    fontWeight: EFontWeight.MEDIUM,
    color: colors.GRAY700,
  },
  removeIcon: {
    cursor: "pointer",
  },
  createdEntries: {
    marginBottom: 20,
  },
});
