import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
  },
  textInput: {
    position: "relative",
    fontFamily: "inherit",
    backgroundColor: "transparent",
    padding: "10px 10px 10px 10px",
    fontSize: "18px",
    borderRadius: "4px",
    border: "2px solid rgba(0,0,0, 0.12)",
    appearance: "none",
    WebkitAppearance: "none",
    color: "gray",
    "&:focus": {
      outline: "none",
      border: "2px solid #4dc1ab",
    },
  },
  label: {
    textAlign: "left",
    color: "rgba(0, 0, 0, 0.7)",
    paddingBottom: 10,
  },
});
