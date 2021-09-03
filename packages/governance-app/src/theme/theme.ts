import { createTheme, responsiveFontSizes } from "@material-ui/core";

export const colors = {
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  STATUS_GREEN: "#00C3A9",
  STATUS_RED: "#D32F2F",
  STATUS_BLUE: "#0078FF",

  MAIN_BACKGROUND_WHITE: "#F9FAFB",
  MAIN_BACKGROUND_GREY: "#F3F4F6",
  MAIN_BACKGROUND_BLACK: "#121212",
  SIDEBAR_BACKGROUND_BLACK: "#181818",

  MAIN_TEXT_BLACK: "#121212",
  MAIN_TEXT_WHITE: "#FFFFFF",

  BOX_BORDER_COLOR: "#F6F6F6",
  STATUS_GREY: "#676767",
  ICON_GREY: "#9ca3af",

  PAPER_GREY_DARK: "#3d3d3d",

  DIVIDER_GREY_LIGHT: "#e5e7eb",
  DIVIDER_GREY_DARK: "#282828",

  PRIMARY_MAIN: "#8174F7",
  PRIMARY_LIGHT: "#9a90f9",
  PRIMARY_DARK: "#7468de",
};

export enum EStatusColor {
  IDLE = "IDLE",
  SUCCESS = "SUCCESS",
  DANGER = "DANGER",
  PRIMARY = "PRIMARY",
}

export enum EButtonStatus {
  primary,
  secondary,
  link,
}

export enum EFontWeight {
  LIGHT = 300,
  REGULAR = 400,
  MEDIUM = 500,
  SEMI_BOLD = 600,
  BOLD = 700,
}

export enum EFontSize {
  BASE = "1rem",
  H1 = "1.383rem",
  H2 = "1.296rem",
  H3 = "1.138rem",
  H4 = "1rem",
  SUBTITLE1 = "0.937rem",
  BODY1 = ".875rem",
  BODY2 = ".75rem",
}

export const getColorFromStatus = (status: EStatusColor) => {
  switch (status) {
    case EStatusColor.DANGER:
      return colors.STATUS_RED;

    case EStatusColor.PRIMARY:
      return colors.STATUS_BLUE;

    case EStatusColor.SUCCESS:
      return colors.STATUS_GREEN;

    case EStatusColor.IDLE:
      return colors.STATUS_GREY;

    default:
      return colors.WHITE;
  }
};

// MATERIAL UI RELATED THEME

// export const titleFontFamily = `"Montserrat", "Roboto", "Helvetica Neue", "Arial", sans-serif`;
export const bodyFontFamily = `"Lato", sans-serif`;

const typography = {
  fontFamily: bodyFontFamily,
  gutterBottom: 10,
  h1: {
    fontSize: EFontSize.H1,
    fontFamily: bodyFontFamily,
  },
  h2: {
    fontSize: EFontSize.H2,
    fontFamily: bodyFontFamily,
  },
  h3: {
    fontSize: EFontSize.H3,
    fontFamily: bodyFontFamily,
  },
  h4: {
    fontSize: EFontSize.H4,
  },
  body1: {
    fontSize: EFontSize.BODY1,
  },
  BODY2: {
    fontSize: EFontSize.BODY2,
  },
  button: {
    fontSize: EFontSize.BASE,
  },
};

const MuiDrawer = {
  root: {
    minWidth: 256,
  },
  paper: {
    background: colors.MAIN_BACKGROUND_GREY,
    minWidth: 256,
    maxWidth: 256,
    // fontSize: 16,
    // all typography is white
    // '& *': {
    //   color: '#fff',
    //   cursor: 'pointer',
    // },
  },
};

const MuiDrawerDark = {
  root: {
    minWidth: 256,
  },
  paper: {
    background: colors.SIDEBAR_BACKGROUND_BLACK,
    minWidth: 256,
    maxWidth: 256,
  },
};

const MuiPaper = {
  root: {
    borderRadius: 3,
    borderColor: colors.DIVIDER_GREY_LIGHT,
    borderWidth: 1,
    borderStyle: "solid",
  },
  rounded: {
    borderRadius: 3,
    borderColor: colors.DIVIDER_GREY_LIGHT,
    borderWidth: 1,
    borderStyle: "solid",
  },
};

const MuiPaperDark = {
  root: {
    borderRadius: 3,
    borderColor: colors.DIVIDER_GREY_DARK,
    borderWidth: 1,
    borderStyle: "solid",
  },
  rounded: {
    borderRadius: 3,
    borderColor: colors.DIVIDER_GREY_DARK,
    borderWidth: 1,
    borderStyle: "solid",
  },
};

const MuiButton = {
  root: {
    fontSize: EFontSize.BASE,
    textTransform: "none" as const,
    borderRadius: 3,
  },
  sizeLarge: {
    fontSize: EFontSize.BASE,
  },
};

const MuiButtonBase = {
  disableRipple: true,
  root: {
    fontSize: EFontSize.BASE,
  },
};

const MuiTextField = {
  root: {
    width: "100%",
    height: 40,
  },
};
const MuiOutlinedInput = {
  input: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 8,
    height: 20,
    borderColor: colors.DIVIDER_GREY_LIGHT,
    borderRadius: 3,
  },
};

export const lightTheme = responsiveFontSizes(
  createTheme({
    overrides: {
      MuiDrawer,
      MuiButton,
      MuiPaper,
      MuiTextField,
      MuiOutlinedInput,
    },
    typography,
    palette: {
      primary: {
        main: colors.PRIMARY_MAIN,
        light: colors.PRIMARY_LIGHT,
        dark: colors.PRIMARY_DARK,
        contrastText: colors.WHITE,
      },
      text: {
        primary: colors.MAIN_TEXT_BLACK,
      },
      background: {
        default: colors.MAIN_BACKGROUND_WHITE,
        paper: colors.MAIN_BACKGROUND_GREY,
      },
      divider: colors.DIVIDER_GREY_LIGHT,
    },
    props: {
      MuiButtonBase,
    },
  }),
);

export const darkTheme = responsiveFontSizes(
  createTheme({
    ...lightTheme,
    overrides: {
      MuiDrawer: MuiDrawerDark,
      MuiButton,
      MuiPaper: MuiPaperDark,
      MuiTextField,
      MuiOutlinedInput,
    },
    typography,
    palette: {
      type: "dark",
      primary: {
        main: colors.PRIMARY_MAIN,
        light: colors.PRIMARY_LIGHT,
        dark: colors.PRIMARY_DARK,
        contrastText: colors.WHITE,
      },
      text: {
        primary: colors.MAIN_TEXT_WHITE,
      },
      background: {
        default: colors.MAIN_BACKGROUND_BLACK,
        paper: colors.PAPER_GREY_DARK,
      },
      divider: colors.DIVIDER_GREY_DARK,
    },
  }),
);
