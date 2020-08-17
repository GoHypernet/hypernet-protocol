import { BoxInstance, BoxSpace } from "3box";

export interface IThreeBoxUtils {
  getBox(): Promise<BoxInstance>;
  getPrivateSpace(): Promise<BoxSpace>;
}
