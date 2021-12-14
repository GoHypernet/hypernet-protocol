import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
  },
  textFieldWrapper: {
    width: 400,
    padding: "5px 10px 0 10px",
  },
  iconClass: {
    cursor: "pointer",
  },
}));
