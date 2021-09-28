import { makeStyles } from "@material-ui/core";
import { colors, EFontSize } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  dialog: (props: any) => ({
    "& .MuiDialog-paper": {
      padding: 40,
      borderRadius: 3,
      backgroundColor: colors.GRAY100,
      border: `2px solid ${colors.GRAY200}`,
    },

    "& .MuiDialogTitle-root": {
      padding: 0,
    },
  }),
  dialogTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: EFontSize.H4,
    padding: 0,
  },
  dialogDescription: {},
  dialogContent: {
    padding: 0,
  },
  closeButton: {
    marginRight: -12,
  },
}));
