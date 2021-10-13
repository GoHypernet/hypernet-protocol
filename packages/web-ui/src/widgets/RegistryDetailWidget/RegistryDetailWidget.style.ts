import { makeStyles } from "@material-ui/core";
import { EFontSize, EFontWeight, colors } from "@web-integration/theme";

export const useStyles = makeStyles({
  form: {
    display: "flex",
    flexDirection: "column",
  },
  optionsContainer: {
    marginTop: 24,
  },
  optionsRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  switchContainer: {
    width: 225,
    margin: "0 2px",
    display: "flex",
    justifyContent: "space-between",
  },
  switchTitle: {
    fontSize: EFontSize.BUTTON_SMALL,
    fontWeight: EFontWeight.MEDIUM,
    color: colors.GRAY700,
  },
  headerDescriptionContainer: {
    marginTop: 24,
    display: "flex",
    alignItems: "center",
  },
  button: {
    marginLeft: "auto",
    marginTop: 40,
  },
  addressChip: {
    marginLeft: 8,
  },
  editableField: {
    borderColor: colors.GRAY500,
  },
});
