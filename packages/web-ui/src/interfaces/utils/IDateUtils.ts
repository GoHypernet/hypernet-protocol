export interface IDateUtils {
  fromTimestampToUI(dateTimestamp: number): string;
  getCurrentIISODateTime(): string;
  fromDatetimeStringToTimestamp(datetimeString?: string): number | null;
  checkTimestampInRang(
    timestamp: number,
    timestampFrom?: number | null,
    timestampTo?: number | null,
  ): boolean;
}
