import "reflect-metadata";
export { IHypernetCore } from "./interfaces/IHypernetCore";
export { HypernetCore } from "./implementations/HypernetCore";
export {
  HypernetLedger,
  EthereumAddress,
  PublicKey,
  BigNumber
} from "./interfaces/objects";
import "./typings/3box";
import "./typings/detect-provider";
