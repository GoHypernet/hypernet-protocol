import { makeStyles } from "@material-ui/core";

import { colors, EFontSize } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  wrapper: (props: any) => ({
    padding: 16,
    marginBottom: 24,
    backgroundColor: colors.GRAY100,
    border: `2px solid ${colors.GRAY200}`,
    borderRadius: 3,
    textAlign: "left",
  }),
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
  rightContent: {
    marginLeft: "auto",
  },
  fieldWrapper: {
    display: "flex",
  },
}));
