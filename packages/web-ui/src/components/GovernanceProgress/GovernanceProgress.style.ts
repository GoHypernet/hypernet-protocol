import { makeStyles } from "@material-ui/core";
import { colors } from "@web-ui/theme";

export const useStyles = makeStyles((theme) => ({
  wrapper: (props: { color?: string; height?: number }) => ({
    "&.MuiLinearProgress-root": {
      borderRadius: 3,
      height: props.height || 6,
      backgroundColor: colors.GRAY200,
    },
    "& .MuiLinearProgress-bar": {
      borderRadius: 3,
      backgroundColor: colors.GRAY200,
    },
    "& .MuiLinearProgress-bar1Determinate": {
      backgroundColor: props.color,
    },
  }),
}));
