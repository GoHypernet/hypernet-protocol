import { createTheme } from "@material-ui/core";

export const colors = {
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  STATUS_GREEN: "#00C3A9",
  STATUS_RED: "#D32F2F",
  STATUS_BLUE: "#0078FF",
  BACKGROUND_GREY: "#F9F9F9",
  MAIN_TEXT_BLACK: "#1D1D1D",
  BOX_BORDER_COLOR: "#F6F6F6",
  STATUS_GREY: "#676767",

  GRAY0: "#FFFFFF",
  GRAY100: "#FAFBFC",
  GRAY150: "#F4F5F7",
  GRAY200: "#DFE1E6",
  GRAY300: "#C1C7D0",
  GRAY400: "#7A869A",
  GRAY500: "#42526E",
  GRAY600: "#172B4D",
  GRAY700: "#091E42",

  PURPLE100: "#EAE6FF",
  PURPLE200: "#C0B6F2",
  PURPLE300: "#998DD9",
  PURPLE400: "#8174F7",
  PURPLE700: "#6554C0",

  GREEN100: "#E3FCEF",
  GREEN200: "#ABF5D1",
  GREEN500: "#006644",

  BLUE100: "#DEEBFF",
  BLUE200: "#B3D4FF",
  BLUE700: "#0747A6",

  RED100: "#FFEBE6",
  RED200: "#FFBDAD",
  RED700: "#BF2600",

  DANGER_ZONE_BUTTON_BG: "#FF5D46",
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
  H1 = "1.602rem",
  H2 = "1.424rem",
  H3 = "1.266rem",
  H4 = "1.125rem",
  H5 = "1rem",
  H6 = ".75rem",

  SUBTITLE1 = "1.266rem",
  BODY1 = "1rem",
  BODY2 = ".889rem",
  BUTTON = ".889rem",
}

export const getColorFromStatus = (status: EStatusColor) => {
  switch (status) {
    case EStatusColor.DANGER:
      return colors.STATUS_RED;

    case EStatusColor.PRIMARY:
      return colors.PURPLE400;

    case EStatusColor.SUCCESS:
      return colors.STATUS_GREEN;

    case EStatusColor.IDLE:
      return colors.STATUS_GREY;

    default:
      return colors.WHITE;
  }
};

const MuiTypography = {
  button: {
    textTransform: "none",
  },
};

const MuiButton = {
  root: {
    fontSize: EFontSize.BUTTON,
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
    textTransform: "none",
  },
};

export const bodyFontFamily = `"Inter", sans-serif`;

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
    fontFamily: bodyFontFamily,
  },
  h5: {
    fontSize: EFontSize.H5,
    fontFamily: bodyFontFamily,
  },
  h6: {
    fontSize: EFontSize.H6,
    fontFamily: bodyFontFamily,
  },
  body1: {
    fontSize: EFontSize.BODY1,
  },
  body2: {
    fontSize: EFontSize.BODY2,
  },
  button: {
    fontSize: EFontSize.BASE,
  },
};

export const lightTheme = createTheme({
  typography,
  palette: {
    primary: {
      main: colors.PURPLE400,
      light: colors.PURPLE300,
      dark: colors.PURPLE700,
      contrastText: colors.WHITE,
    },
    text: {
      primary: colors.GRAY700,
    },
    divider: colors.GRAY200,
  },
  overrides: {
    // @ts-ignore
    MuiTypography,
    MuiButton,
  },
  props: {
    MuiButtonBase,
  },
});

export const darkTheme = createTheme({
  typography,
  palette: {
    type: "dark",
  },
  overrides: {
    // @ts-ignore
    MuiTypography,
    MuiButton,
  },
  props: {
    MuiButtonBase,
  },
});
