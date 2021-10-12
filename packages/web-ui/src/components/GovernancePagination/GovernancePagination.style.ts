import { makeStyles } from "@material-ui/core";
import { colors } from "@web-ui/theme";

export const useStyles = makeStyles(() => ({
  pagination: (props: { widgetUniqueIdentifier: string }) => ({
    display: "flex",
    justifyContent: "flex-end",
    [`& .${props.widgetUniqueIdentifier}-MuiPaginationItem-page.Mui-selected`]:
      {
        color: colors.GRAY150,
        backgroundColor: colors.GRAY500,
      },
  }),
}));
