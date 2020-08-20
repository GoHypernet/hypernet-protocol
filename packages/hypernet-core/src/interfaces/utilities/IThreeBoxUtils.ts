import { BoxInstance, BoxSpace, BoxThread } from "3box";
import { Address } from "@interfaces/objects";

export interface IThreeBoxUtils {
  getBox(): Promise<BoxInstance>;
  getSpaces(spaceNames: string[]): Promise<{ [spaceName: string]: BoxSpace }>;
  getThreads(spaceName: string, threadAddresses: Address[]): Promise<BoxThread[]>;
}
