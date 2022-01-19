import { makeStyles } from "@material-ui/core";

import { colors, EFontSize } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  wrapper: (props: any) => ({
    padding: 8,
    border: `1px solid ${colors.PURPLE400}`,
    borderRadius: 3,
    cursor: "pointer",
    textAlign: "left",
  }),
  dialogTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: EFontSize.H4,
  },
  list: {
    padding: "24px 40px",
  },
  listItem: {
    padding: "12px 16px",
    "&:hover": {
      backgroundColor: colors.GRAY200,
      borderRadius: 3,
    },
  },
  title: {
    marginBottom: 28,
  },
  field: {
    width: "100%",
    border: "none",
    background: "transparent",
    outline: "none",
    color: theme.palette.text.primary,
    fontSize: EFontSize.BODY2,

    "&::placeholder": {
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: colors.GRAY500,
      opacity: 1 /* Firefox */,
    },
    "&:-ms-input-placeholder": {
      /* Internet Explorer 10-11 */
      color: colors.GRAY500,
    },
    "&::-ms-input-placeholder": {
      /* Microsoft Edge */
      color: colors.GRAY500,
    },
  },
  fieldTextWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));
