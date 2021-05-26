import { IDateUtils } from "@web-ui/interfaces";
import { getColorFromStatus, EStatusColor } from "@web-ui/theme";

export class DateUtils implements IDateUtils {
  public fromTimestampToUI(dateTimestamp: number): string {
    if (dateTimestamp == null) return "";

    const date = new Date(this._getTimestamp(dateTimestamp));
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

  public fromDatetimeStringToTimestamp(datetimeString?: string): number | null {
    if (datetimeString == null) {
      return null;
    }
    return Date.parse(datetimeString);
  }

  public checkTimestampInRang(
    timestamp: number,
    timestampFrom?: number | null,
    timestampTo?: number | null,
  ): boolean {
    if (timestampFrom == null || timestampTo == null) {
      return true;
    }
    return (
      this._getTimestamp(timestamp) >= this._getTimestamp(timestampFrom) &&
      this._getTimestamp(timestamp) <= this._getTimestamp(timestampTo)
    );
  }

  private _getTimestamp(timestamp: number) {
    if (`${timestamp}`.length < 11) {
      return timestamp * 1000;
    }
    return timestamp;
  }
}
