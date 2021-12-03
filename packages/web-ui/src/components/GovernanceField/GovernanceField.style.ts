import { makeStyles } from "@material-ui/core";

import { colors, EFontSize } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  wrapper: (props: any) => ({
    marginBottom: 24,
    textAlign: "left",
  }),
  title: {
    marginBottom: 8,
  },
  field: {
    width: "100%",
    background: colors.GRAY100,
    borderRadius: 3,
    padding: "12px 16px",
    color: theme.palette.text.primary,
    fontSize: EFontSize.BODY2,
    border: `2px solid ${colors.GRAY300}`,

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
