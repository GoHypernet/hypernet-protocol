import { BoxInstance, BoxSpace, BoxThread } from "3box";

export interface IThreeBoxUtils {
  getBox(): Promise<BoxInstance>;
  getSpaces(spaceNames: string[]): Promise<{ [spaceName: string]: BoxSpace }>;
  getHypernetProtocolSpace(): Promise<BoxSpace>;
  getThreads(threadAddresses: string[]): Promise<{ [threadAddress: string]: BoxThread }>;
  getDiscoveryThread(): Promise<BoxThread>;
  getDID(): Promise<string>;
}
