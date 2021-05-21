export const colors = {
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  STATUS_GREEN: "#00C3A9",
  STATUS_RED: "#D32F2F",
  STATUS_BLUE: "#0078FF",
  BACKGROUND_GREY: "#F9F9F9",
  MAIN_TEXT_BLACK: "#1D1D1D",
  BOX_BORDER_COLOR: "#F6F6F6",
};

export enum EStatusColor {
  IDLE = "IDLE",
  SUCCESS = "SUCCESS",
  DANGER = "DANGER",
  PRIMARY = "PRIMARY",
}

export const getColorFromStatus = (status: EStatusColor) => {
  switch (status) {
    case EStatusColor.DANGER:
      return colors.STATUS_RED;

    case EStatusColor.PRIMARY:
      return colors.STATUS_BLUE;

    case EStatusColor.SUCCESS:
      return colors.STATUS_GREEN;

    default:
      return colors.WHITE;
  }
};