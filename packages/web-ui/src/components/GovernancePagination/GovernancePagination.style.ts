import { makeStyles } from "@material-ui/core";
import { colors } from "@web-ui/theme";

export const useStyles = makeStyles(() => ({
  pagination: {
    display: "flex",
    justifyContent: "flex-end",
    "& .MuiPaginationItem-page.Mui-selected": {
      color: colors.GRAY150,
      backgroundColor: colors.GRAY500,
    },
  },
}));
