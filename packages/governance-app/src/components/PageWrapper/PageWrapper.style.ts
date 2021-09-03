import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  wrapper: (props) => {
    console.log(theme, props);
    return {
      minHeight: "calc(100vh - 80px)",
      padding: 40,
      width: "100%",
      alignItems: "center",
      background: theme.palette.background.default,
    };
  },
  label: {
    display: "flex",
    fontSize: 24,
    marginBottom: 30,
  },
  rightContent: {
    marginLeft: "auto",
  },
}));
