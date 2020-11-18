import { BoxInstance, BoxSpace, BoxThread } from "3box";

/**
 * @todo What is the main role/purpose of this class? Description here
 * @todo Do we need this anymore? Maybe remove?
 */
export interface IThreeBoxUtils {
  getBox(): Promise<BoxInstance>;
  getSpaces(spaceNames: string[]): Promise<{ [spaceName: string]: BoxSpace }>;
  getHypernetProtocolSpace(): Promise<BoxSpace>;
  getThreads(threadAddresses: string[]): Promise<{ [threadAddress: string]: BoxThread }>;
  getDiscoveryThread(): Promise<BoxThread>;
  getControlThread(): Promise<BoxThread>;
  getDID(): Promise<string>;
}
