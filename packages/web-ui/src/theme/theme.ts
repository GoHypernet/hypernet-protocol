export const colors = {
  WHITE: "#FFFFFF",
  STATUS_GREEN: "#00C3A9",
  STATUS_RED: "#D32F2F",
  STATUS_BLUE: "#0078FF",
  STATUS_GREY: "#676767",
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

    case EStatusColor.IDLE:
      return colors.STATUS_GREY;

    default:
      return colors.WHITE;
  }
};
