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
  H1 = "1.5rem",
  H2 = "1.17rem",
  H3 = "1.15rem",
  H4 = "1.12rem",
  H5 = ".875rem",
  H6 = ".75rem",
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
