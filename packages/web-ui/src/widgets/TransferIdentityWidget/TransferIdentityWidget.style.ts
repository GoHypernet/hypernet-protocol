import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  wrapper: {
    height: 200,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  actionContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  saveButton: {
    marginLeft: 16,
  },
});
