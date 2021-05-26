import { IDateUtils } from "@web-ui/interfaces";
import { getColorFromStatus, EStatusColor } from "@web-ui/theme";

export class DateUtils implements IDateUtils {
  public fromTimestampToUI(dateTimestamp: number): string {
    if (dateTimestamp == null) return "";

    const date = new Date(
      dateTimestamp * (`${dateTimestamp}`.length > 10 ? 1 : 1000),
    );
    return `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  }

  public getCurrentIISODateTime(): string {
    const date = new Date();
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .substring(0, 16);
  }
}
