import { BoxInstance, BoxSpace, BoxThread } from "3box";
import { EthereumAddress } from "@interfaces/objects";

export interface IThreeBoxUtils {
  getBox(account: string): Promise<BoxInstance>;
  getSpaces(spaceNames: string[]): Promise<{ [spaceName: string]: BoxSpace }>;
  getHypernetProtocolSpace(): Promise<BoxSpace>;
  getThreads(spaceName: string, threadAddresses: EthereumAddress[]): Promise<BoxThread[]>;
  getDiscoveryThread(): Promise<BoxThread>;
}
