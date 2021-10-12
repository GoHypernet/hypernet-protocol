import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  form: {
    display: "flex",
    flexDirection: "column",
  },
  cardContainer: {
    display: "flex",
  },
  fieldContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  descriptionContainer: {
    display: "flex",
    alignItems: "center",
  },
  descriptionText: {
    marginLeft: 16,
  },
  button: {
    marginTop: 40,
    alignSelf: "flex-end",
  },
  copyIcon: {
    marginTop: "auto",
    marginBottom: 16,
    marginLeft: 4,
  },
});
