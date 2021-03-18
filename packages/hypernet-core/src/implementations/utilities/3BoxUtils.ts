// import { BoxInstance, BoxSpace, BoxThread, openBox } from "3box";
// import { IThreeBoxUtils, IBlockchainProvider, IContextProvider, IConfigProvider } from "@interfaces/utilities";
// import { EthereumAddress, HypernetConfig, InitializedHypernetContext, ResultAsync } from "@hypernetlabs/objects";
// import { BlockchainUnavailableError, ThreeBoxError } from "@hypernetlabs/objects/errors";
// import { okAsync } from "neverthrow";
// import { ResultUtils } from "@hypernetlabs/utils";

// export class ThreeBoxUtils implements IThreeBoxUtils {
//   protected boxResult: ResultAsync<BoxInstance, BlockchainUnavailableError | ThreeBoxError> | null;
//   protected privateSpace: BoxSpace | null;
//   protected ethereumAccounts: string[];
//   protected spaces: Map<string, BoxSpace>;
//   protected threads: Map<string, BoxThread>;

//   public constructor(
//     protected blockchainProvider: IBlockchainProvider,
//     protected contextProvider: IContextProvider,
//     protected configProvider: IConfigProvider,
//   ) {
//     this.boxResult = null;
//     this.privateSpace = null;
//     this.ethereumAccounts = [];
//     this.spaces = new Map<string, BoxSpace>();
//     this.threads = new Map<string, BoxThread>();
//   }

//   public getBox(): ResultAsync<BoxInstance, BlockchainUnavailableError | ThreeBoxError> {
//     if (this.boxResult != null) {
//       return this.boxResult;
//     }

//     this.boxResult = ResultUtils.combine([
//       this.blockchainProvider.getProvider(),
//       this.contextProvider.getInitializedContext(),
//     ])
//       .andThen((vals) => {
//         const [provider, context] = vals;
//         return ResultAsync.fromPromise(openBox(context.account, provider), (e) => {
//           return new ThreeBoxError(e as Error);
//         });
//       })
//       .map((boxInstance) => {
//         // Don't do anything until the sync is complete
//         // await this.box.syncDone;
//         return boxInstance;
//       });

//     return this.boxResult;
//   }

//   public getSpaces(
//     spaceNames: string[],
//   ): ResultAsync<Map<string, BoxSpace>, BlockchainUnavailableError | ThreeBoxError> {
//     const returnSpaces = new Map<string, BoxSpace>();
//     const spacesToAuth = new Array<string>();

//     for (const spaceName of spaceNames) {
//       const space = this.spaces.get(spaceName);
//       if (space == null) {
//         // Need to auth the space
//         spacesToAuth.push(spaceName);
//       } else {
//         returnSpaces.set(spaceName, space);
//       }
//     }

//     if (spacesToAuth.length === 0) {
//       // All the spaces are already authed and in the cache.
//       return okAsync(returnSpaces);
//     }

//     // We need to authorize at least some of the spaces
//     let context: InitializedHypernetContext;
//     let box: BoxInstance;
//     return ResultUtils.combine([this.contextProvider.getInitializedContext(), this.getBox()])
//       .andThen((vals) => {
//         [context, box] = vals;

//         // Authenticate the spaces
//         return ResultAsync.fromPromise(box.auth(spacesToAuth, { address: context.account }), (e) => {
//           return new ThreeBoxError(e as Error);
//         });
//       })
//       .andThen(() => {
//         const newSpaceResults = new Array<ResultAsync<{ spaceName: string; space: BoxSpace }, ThreeBoxError>>();

//         for (const spaceName of spacesToAuth) {
//           newSpaceResults.push(this._authSpace(box, spaceName));
//         }

//         return ResultUtils.combine(newSpaceResults);
//       })
//       .andThen((authedSpaces) => {
//         // Loop over the spaces we just opened, we're going to await them individually
//         for (const authedSpace of authedSpaces) {
//           // Add it to the cache
//           this.spaces.set(authedSpace.spaceName, authedSpace.space);

//           // Add it to the return
//           returnSpaces.set(authedSpace.spaceName, authedSpace.space);
//         }

//         return okAsync(returnSpaces);
//       });
//   }

//   public getHypernetProtocolSpace(): ResultAsync<BoxSpace, ThreeBoxError | BlockchainUnavailableError> {
//     let config: HypernetConfig;

//     return this.configProvider
//       .getConfig()
//       .andThen((myConfig) => {
//         config = myConfig;

//         // Get the main space, the list of channels is here.
//         return this.getSpaces([config.hypernetProtocolSpace]);
//       })
//       .map((spaces) => {
//         return spaces.get(config.hypernetProtocolSpace) as BoxSpace;
//       });
//   }

//   public getThreads(
//     threadAddresses: string[],
//   ): ResultAsync<Map<string, BoxThread>, BlockchainUnavailableError | ThreeBoxError> {
//     const returnThreads = new Map<string, BoxThread>();
//     const threadsToJoin = new Array<EthereumAddress>();

//     for (const threadAddress of threadAddresses) {
//       const thread = this.threads.get(threadAddress);
//       if (thread == null) {
//         // Need to join the thread
//         threadsToJoin.push(threadAddress);
//       } else {
//         returnThreads.set(threadAddress, thread);
//       }
//     }

//     if (threadsToJoin.length === 0) {
//       // All the threads are already joined
//       return okAsync(returnThreads);
//     }

//     // Need to join some more threads
//     return this.getHypernetProtocolSpace()
//       .andThen((space) => {
//         // Now start the process of joining each of the threads
//         const newThreadresults = new Array<ResultAsync<{ threadAddress: string; thread: BoxThread }, ThreeBoxError>>();

//         for (const threadAddress of threadsToJoin) {
//           newThreadresults.push(this._joinThread(threadAddress, space));
//         }

//         return ResultUtils.combine(newThreadresults);
//       })
//       .map((joinedThreads) => {
//         // Loop over the threads
//         for (const joinedThread of joinedThreads) {
//           // Add it to the cache
//           this.threads.set(joinedThread.threadAddress, joinedThread.thread);

//           // Add it to the return
//           returnThreads.set(joinedThread.threadAddress, joinedThread.thread);
//         }

//         return returnThreads;
//       });
//   }

//   public getDiscoveryThread(): ResultAsync<BoxThread, ThreeBoxError | BlockchainUnavailableError> {
//     return this.getHypernetProtocolSpace().andThen((space) => {
//       return ResultAsync.fromPromise(
//         space.joinThread("config.discoveryThreadName", {
//           ghost: true,
//           ghostBacklogLimit: 50,
//         }),
//         (e) => {
//           return new ThreeBoxError(e as Error);
//         },
//       );
//     });
//   }

//   public getControlThread(): ResultAsync<BoxThread, ThreeBoxError | BlockchainUnavailableError> {
//     return this.getHypernetProtocolSpace().andThen((space) => {
//       return ResultAsync.fromPromise(
//         space.joinThread("config.controlThreadName", {
//           ghost: true,
//           ghostBacklogLimit: 0,
//         }),
//         (e) => {
//           return new ThreeBoxError(e as Error);
//         },
//       );
//     });
//   }

//   public getDID(): ResultAsync<string, ThreeBoxError | BlockchainUnavailableError> {
//     return this.getBox().map((box) => {
//       return box.DID;
//     });
//   }

//   protected _authSpace(
//     box: BoxInstance,
//     spaceName: string,
//   ): ResultAsync<{ spaceName: string; space: BoxSpace }, ThreeBoxError> {
//     return ResultAsync.fromPromise(box.openSpace(spaceName), (e) => {
//       return new ThreeBoxError(e as Error);
//     }).map((space) => {
//       return { spaceName, space };
//     });
//   }

//   protected _joinThread(
//     threadAddress: string,
//     space: BoxSpace,
//   ): ResultAsync<{ threadAddress: string; thread: BoxThread }, ThreeBoxError> {
//     return ResultAsync.fromPromise(space.joinThreadByAddress(threadAddress), (e) => {
//       return new ThreeBoxError(e as Error);
//     }).map((thread) => {
//       return { threadAddress, thread };
//     });
//   }
// }
