import { makeStyles } from "@material-ui/core";

import { EFontSize, colors } from "@web-ui/theme";
import { useWidgetUniqueIdentifier } from "@web-ui/hooks";

export const useStyles = () => {
  const widgetUniqueIdentifier = useWidgetUniqueIdentifier();

  const styles = makeStyles(() => ({
    drawerContainer: () => ({
      cursor: "pointer",
      width: 400,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      overflowX: "hidden",
      [`& .${widgetUniqueIdentifier}MuiTextField-root`]: {
        width: "100%",
      },
      [`& .${widgetUniqueIdentifier}MuiFilledInput-root`]: {
        borderRadius: 0,
      },
      [`& .${widgetUniqueIdentifier}MuiSelect-outlined.MuiSelect-outlined`]: {
        padding: 12,
      },
    }),
    header: {
      padding: "8px 40px",
      cursor: "auto",
    },
    body: {
      cursor: "auto",
      padding: "20px 40px",
    },
    footer: {
      display: "flex",
      justifyContent: "flex-end",
      padding: "20px 40px",
    },
    headerInfo: {
      color: "#9A9A9A",
      marginLeft: 10,
    },
    headerIcon: {
      fontSize: 24,
      color: "#9A9A9A",
      cursor: "pointer",
    },
    filterChipItem: {
      margin: 4,
      border: `1px solid ${colors.GRAY200}`,
      backgroundColor: colors.WHITE,
    },
    checkItem: {
      marginTop: 16,
      opacity: 0.9,
    },
    filterChipItemSelected: {
      backgroundColor: colors.GRAY200,
    },
    widgetWrapper: { marginBottom: 24 },
    widgetLabel: {
      marginBottom: 8,
    },
    submitButton: {
      marginLeft: 16,
    },
    cancelButton: {},
    inputAdornment: {
      margin: "0 !important",
    },
    appliedFilterContainer: {
      marginTop: 8,
      marginBottom: 8,
      display: "flex",
      flexWrap: "wrap",
      listStyle: "none",
      padding: 4,
    },
    dateLabel: {
      width: 48,
    },
    dateWrapper: {
      display: "flex",
      alignItems: "center",
      marginBottom: 16,
    },
    textFieldWrapper: () => ({
      margin: 0,
      "& input": {
        fontSize: EFontSize.BODY2,
        padding: 12,
        backgroundColor: colors.GRAY100,
      },
      [`& .${widgetUniqueIdentifier}MuiInput-underline:after`]: {
        display: "none",
      },
      [`& .${widgetUniqueIdentifier}MuiInput-underline:before`]: {
        display: "none",
      },
    }),
    selectWrapper: {
      border: "none",
    },
  }));

  return styles();
};
