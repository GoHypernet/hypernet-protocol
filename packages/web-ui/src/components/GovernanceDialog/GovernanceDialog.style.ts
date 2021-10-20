import { makeStyles } from "@material-ui/core";

import { colors, EFontSize } from "@web-ui/theme";
import { useWidgetUniqueIdentifier } from "@web-ui/hooks";

export const useStyles = () => {
  const widgetUniqueIdentifier = useWidgetUniqueIdentifier();

  const styles = makeStyles(() => ({
    dialog: () => ({
      [`& .${widgetUniqueIdentifier}MuiDialog-paper`]: {
        borderRadius: 3,
        backgroundColor: colors.GRAY100,
        border: `2px solid ${colors.GRAY200}`,
      },

      [`& .${widgetUniqueIdentifier}MuiDialogTitle-root`]: {
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

  return styles();
};
