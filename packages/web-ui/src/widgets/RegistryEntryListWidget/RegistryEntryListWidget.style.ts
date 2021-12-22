import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  headerBottomContentWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  searchBySelectWrapper: {
    margin: "0 8px 0 0",
    minWidth: 150,
  },
  searchFilterWrapper: {
    marginTop: 8,
  },
  searchForm: {
    display: "flex",
    alignItems: "flex-end",
  },
  sortWrapper: {
    marginTop: 16,
    display: "flex",
    alignItems: "center",
  },
  reverseSortLabel: {
    paddingRight: 5,
  },
});
