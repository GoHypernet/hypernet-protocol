import { makeStyles } from "@material-ui/core";
import { colors } from "@web-ui/theme";

export const useStyles = makeStyles({
  root: {
    "&&:hover": {
      backgroundColor: "transparent",
    },
  },
  icon: {
    borderRadius: 3,
    width: 14,
    height: 14,
    border: `2px solid ${colors.GRAY300}`,
    backgroundColor: colors.WHITE,
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  checkedIcon: {
    backgroundColor: colors.BLUE400,
    borderRadius: 3,
    border: `2px solid ${colors.BLUE400}`,
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 14,
      height: 14,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
  },
});
