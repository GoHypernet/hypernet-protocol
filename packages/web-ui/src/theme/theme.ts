import { Palette } from "@hypernetlabs/objects";
import {
  createTheme,
  Theme,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core";

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
  GRAY300: "#EBECF0",
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
  GREEN500: "#36B37E",
  GREEN700: "#006644",

  BLUE100: "#DEEBFF",
  BLUE200: "#B3D4FF",
  BLUE300: "#4C9AFF",
  BLUE400: "#0052CC",
  BLUE700: "#0747A6",

  RED100: "#FFEBE6",
  RED200: "#FFBDAD",
  RED400: "#DE350B",
  RED700: "#BF2600",

  ORANGE100: "#FFFAE6",
  ORANGE200: "##FFE380",
  ORANGE400: "#FFAB00",
  ORANGE700: "#FF8B00",
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
  H1 = "1.476rem",
  H2 = "1.383rem",
  H3 = "1.296rem",
  H4 = "1.215rem",
  H5 = "1.138rem",
  H6 = "1.067rem",

  SUBTITLE1 = "1rem",
  SUBTITLE2 = ".878rem",

  BODY1 = ".878rem",
  BODY2 = ".823rem",

  BUTTON_LARGE = "1rem",
  BUTTON_MEDIUM = ".878rem",
  BUTTON_SMALL = ".772rem",

  LABEL_LARGE = ".878rem",
  LABEL_SMALL = ".772rem",
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
    padding: "12px",
    fontSize: EFontSize.BUTTON_MEDIUM,
    textTransform: "none" as const,
    borderRadius: 3,
  },
  outlined: {
    padding: "12px",
  },
  text: {
    padding: "12px",
  },

  sizeSmall: {
    padding: "8px 12px",
    fontSize: EFontSize.BUTTON_SMALL,
  },
  outlinedSizeSmall: {
    padding: "8px 12px",
    fontSize: EFontSize.BUTTON_SMALL,
  },
  containedSizeSmall: {
    padding: "8px 12px",
    fontSize: EFontSize.BUTTON_SMALL,
  },

  sizeLarge: {
    fontSize: EFontSize.BUTTON_LARGE,
  },
  outlinedSizeLarge: {
    fontSize: EFontSize.BUTTON_LARGE,
  },
  containedSizeLarge: {
    fontSize: EFontSize.BUTTON_LARGE,
  },
};

const MuiCheckbox = {
  root: {
    "&&:hover": {
      backgroundColor: "transparent",
    },
  },
  colorPrimary: {
    "&$checked": {
      color: colors.BLUE400,
    },
  },
};

const MuiButtonBase = {
  disableRipple: true,
  root: {
    fontSize: EFontSize.BASE,
    textTransform: "none",
  },
};

const MuiTextField = {
  root: {
    background: colors.GRAY100,
    border: `2px solid ${colors.GRAY200}`,
    borderRadius: 3,
    fontSize: EFontSize.BODY2,
  },
};

const MuiAutocomplete = {
  option: {
    paddingTop: 0,
    paddingBottom: 0,
  },
};

const MuiChip = {
  root: {
    borderRadius: 3,
  },
  deleteIcon: {
    margin: "0 4px 0 0",
    width: 16,
    height: 16,
  },
};

// GovernanceProgress applies height and backgroundColor inline.
const MuiLinearProgress = {
  root: {
    height: "inherit",
    borderRadius: 3,
    backgroundColor: colors.GRAY200,
  },
  barColorPrimary: {
    backgroundColor: "inherit",
  },
  bar: {
    borderRadius: 3,
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
  subtitle1: {
    fontSize: EFontSize.SUBTITLE1,
    fontFamily: bodyFontFamily,
  },
  subtitle2: {
    fontSize: EFontSize.SUBTITLE2,
    fontFamily: bodyFontFamily,
  },
  body1: {
    fontSize: EFontSize.BODY1,
    fontFamily: bodyFontFamily,
  },
  body2: {
    fontSize: EFontSize.BODY2,
    fontFamily: bodyFontFamily,
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
      secondary: colors.GRAY500,
    },
    divider: colors.GRAY200,
  },
  overrides: {
    // @ts-ignore
    MuiTypography,
    MuiButton,
    MuiTextField,
    MuiLinearProgress,
    MuiAutocomplete,
    MuiChip,
    MuiCheckbox,
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

export const injectCustomPaletteToTheme = (
  theme: Theme,
  customPalette: Palette,
) => {
  const { palette } = theme;
  
  const injectedPalette = {
    primary: { ...palette.primary, ...customPalette?.primary },
    text: { ...palette.text, ...customPalette?.text },
    divider: customPalette?.divider || palette.divider,
  };

  return createTheme({ ...theme, palette: injectedPalette });
};

export const ThemeProvider = MuiThemeProvider;
