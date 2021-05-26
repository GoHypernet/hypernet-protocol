export interface IDateUtils {
  fromTimestampToUI(dateTimestamp: number): string;
  getCurrentIISODateTime(): string;
}
