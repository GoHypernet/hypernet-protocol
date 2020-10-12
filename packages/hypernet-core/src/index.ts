import "reflect-metadata";
export { IHypernetCore } from "@interfaces/IHypernetCore";
export { HypernetCore } from "@implementations/HypernetCore";
export {
  HypernetLink,
  EthereumAddress,
  PublicKey,
  BigNumber,
  EstablishLinkRequest,
  EstablishLinkRequestWithApproval,
} from "@interfaces/objects";
export { ELinkStatus, EMessageType, ELinkRole } from "@interfaces/types";
import "./typings/3box";
import "./typings/detect-provider";
