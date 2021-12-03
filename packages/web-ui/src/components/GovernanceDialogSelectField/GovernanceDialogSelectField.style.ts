import { makeStyles } from "@material-ui/core";

import { colors, EFontSize } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  wrapper: (props: any) => ({
    marginBottom: 24,
    cursor: "pointer",
    textAlign: "left",
  }),
  dialogTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row-reverse",
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
    marginBottom: 8,
  },
  field: {
    width: "100%",
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
    border: `2px solid ${colors.GRAY300}`,
    padding: "12px 16px",
    borderRadius: 3,
    background: colors.GRAY100,
  },
  dialogCloseButton: {
    marginLeft: "auto",
  },
}));
