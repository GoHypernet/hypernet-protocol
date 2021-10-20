import { makeStyles } from "@material-ui/core";
import { colors } from "@web-ui/theme";
import { useWidgetUniqueIdentifier } from "@web-ui/hooks";

export const useStyles = () => {
  const widgetUniqueIdentifier = useWidgetUniqueIdentifier();

  const styles = makeStyles(() => ({
    pagination: {
      display: "flex",
      justifyContent: "flex-end",
      [`& .${widgetUniqueIdentifier}MuiPaginationItem-page.Mui-selected`]: {
        color: colors.GRAY150,
        backgroundColor: colors.GRAY500,
      },
    },
  }));

  return styles();
};
