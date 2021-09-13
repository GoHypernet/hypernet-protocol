import { colors } from "@hypernetlabs/web-ui";
import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    maxWidth: 640,
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  formItem: {
    borderRadius: 20,
  },
  proposalDescription: {
    "& textarea": {
      height: "100%",
    },
  },
  proposalFieldContainer: { borderRadius: 20, padding: 20, marginTop: 12 },
  proposalFieldLabel: { marginBottom: 8 },
  submitButton: { marginTop: 18, height: 54, borderRadius: 20 },
});
