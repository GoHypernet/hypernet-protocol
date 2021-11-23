import { makeStyles, createTheme } from "@material-ui/core";

import { EFontSize, EFontWeight } from "@web-ui/theme";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
      light: "#83f4dd",
      dark: "#092238",
      contrastText: "#fff",
    },
  },
  overrides: {
    MuiDrawer: {
      paper: {
        background: "FFFFFF",
        maxWidth: 500,
        boxShadow: "0px 1px 3px #00000029",
        borderRadius: "6px",
        cursor: "auto",
      },
    },
    MuiCheckbox: {
      colorSecondary: {
        "&$checked": {
          color: "#4dc1ab",
        },
      },
    },
    MuiTextField: {
      root: {
        width: "100%",
      },
    },
  },
  typography: {
    h4: {
      fontSize: EFontSize.H4,
      fontWeight: EFontWeight.REGULAR,
      color: "#707070",
    },
    h5: {
      fontSize: EFontSize.H5,
      fontWeight: EFontWeight.REGULAR,
      color: "#707070",
    },
  },
});

export const useStyles = makeStyles({
  drawerContainer: {
    cursor: "pointer",
    width: 400,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    overflowX: "hidden",
  },
  header: {
    padding: "15px 20px",
    borderBottom: "1px solid #E9E9E9",
    cursor: "auto",
  },
  body: {
    padding: "4px 24px",
    cursor: "auto",
  },
  footer: {
    marginBottom: 30,
    marginTop: 40,
    width: "100%",
    backgroundColor: "#ffffff",
  },
  headerLabel: {
    fontSize: 24,
    color: "#707070",
  },
  headerInfo: {
    fontSize: 14,
    color: "#9A9A9A",
    marginLeft: 10,
  },
  headerIconWrapper: {
    paddingRight: 0,
  },
  headerIcon: {
    fontSize: 24,
    color: "#9A9A9A",
    cursor: "pointer",
  },
  filterChipItem: {
    margin: theme.spacing(0.5),
    border: "1px solid #E9E9E9",
    backgroundColor: "#FFFFFF",
  },
  checkItem: {
    marginTop: 16,
    opacity: 0.9,
  },
  checkItemLabel: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: 300,
  },
  filterChipItemSelected: {
    backgroundColor: "#E9E9E9",
  },
  widgetLabel: {
    color: "#9A9A9A",
    fontSize: 14,
    marginTop: 35,
    marginBottom: 13,
  },
  missionTypeSelectWidget: {
    width: "100%",
  },
  searchInput: {
    width: "100%",
  },
  submitButton: {
    marginRight: 24,
    marginLeft: 16,
    width: "92%",
  },
  cancelButton: {
    width: "100%",
    marginTop: 10,
  },
  searchContainer: {
    borderRadius: 4,
    margin: 0,
    "& input": {
      fontSize: 16,
      padding: 12,
      opacity: 0.8,
    },
    "& div": {
      height: "100%",
      borderRadius: 4,
    },
  },
  inputAdornment: {
    margin: "0 !important",
  },
  searchIcon: {
    color: "#747474",
    fontSize: 20,
  },
  resetButton: {
    color: "#2196F3",
  },
  appliedFilterContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: "flex",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
  },
});
