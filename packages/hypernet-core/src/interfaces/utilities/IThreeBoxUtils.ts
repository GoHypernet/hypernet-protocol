import { BoxInstance, BoxSpace } from "3box";

export interface IThreeBoxUtils {
  getBox(): Promise<BoxInstance>;
  getSpaces(spaceNames: string[]): Promise<{ [spaceName: string]: BoxSpace }>;
}
