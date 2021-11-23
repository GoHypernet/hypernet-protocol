import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
    height: "auto",
  },
  select: {
    fontFamily: "'Roboto','Helvetica','Arial',sans-serif",
    position: "relative",
    width: "100%",
    "&:after": {
      position: "absolute",
      top: "18px",
      right: "10px",
      width: "0",
      height: "0",
      padding: "0",
      content: "''",
      borderLeft: "6px solid transparent",
      borderRight: "6px solid transparent",
      borderTop: "6px solid rgba(0, 0, 0, 0.12)",
      pointerEvents: "none",
    },
  },
  selectText: {
    position: "relative",
    fontFamily: "inherit",
    backgroundColor: "transparent",
    padding: "10px 10px 10px 10px",
    fontSize: "18px",
    borderRadius: "4px",
    border: "2px solid rgba(0,0,0, 0.12)",
    appearance: "none",
    WebkitAppearance: "none",
    width: "100%",
    color: "gray",
    "&:focus": {
      outline: "none",
      border: "2px solid #4dc1ab",
    },
  },
  selectLabel: {
    textAlign: "left",
    color: "rgba(0, 0, 0, 0.7)",
    paddingBottom: 10,
  },
});
