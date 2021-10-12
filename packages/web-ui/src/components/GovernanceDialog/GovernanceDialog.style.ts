import { makeStyles } from "@material-ui/core";
import { colors, EFontSize } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  dialog: (props: { widgetUniqueIdentifier: string }) => ({
    [`& .${props.widgetUniqueIdentifier}-MuiDialog-paper`]: {
      borderRadius: 3,
      backgroundColor: colors.GRAY100,
      border: `2px solid ${colors.GRAY200}`,
    },

    [`& .${props.widgetUniqueIdentifier}-MuiDialogTitle-root`]: {
      padding: 0,
    },
  }),
  dialogTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: EFontSize.H4,
    padding: "16px 40px",
  },
  dialogDescription: {},
  dialogContent: {
    padding: "16px 40px",
  },
  closeButton: {
    marginRight: -12,
  },
}));
