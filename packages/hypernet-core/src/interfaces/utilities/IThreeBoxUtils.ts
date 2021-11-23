// import "../../typings/3box";
// import { BoxInstance, BoxSpace, BoxThread } from "3box";
// import { ResultAsync } from "neverthrow";
// import { BlockchainUnavailableError, ThreeBoxError } from "@hypernetlabs/objects";

// /**
//  * These utilities wrap up interactions with 3Box, but does not provide complete isolation. It still deals with
//  * native 3Box objects, but does make the 3Box API easier to work with and wraps it up with neverthrow.
//  */
// export interface IThreeBoxUtils {
//   getBox(): ResultAsync<BoxInstance, BlockchainUnavailableError | ThreeBoxError>;
//   getSpaces(spaceNames: string[]): ResultAsync<Map<string, BoxSpace>, BlockchainUnavailableError | ThreeBoxError>;
//   getHypernetProtocolSpace(): ResultAsync<BoxSpace, ThreeBoxError | BlockchainUnavailableError>;
//   getThreads(
//     threadAddresses: string[],
//   ): ResultAsync<Map<string, BoxThread>, BlockchainUnavailableError | ThreeBoxError>;
//   getDiscoveryThread(): ResultAsync<BoxThread, ThreeBoxError | BlockchainUnavailableError>;
//   getControlThread(): ResultAsync<BoxThread, ThreeBoxError | BlockchainUnavailableError>;
//   getDID(): ResultAsync<string, ThreeBoxError | BlockchainUnavailableError>;
// }
