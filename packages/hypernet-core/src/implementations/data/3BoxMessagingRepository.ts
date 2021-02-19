import { IMessagingRepository } from "@interfaces/data";
import {
  Message,
  MessageThread,
  EthereumAddress,
  ThreadMetadata,
  EstablishLinkRequest,
  MessagePayload,
  ControlClaim,
  ResultAsync,
} from "@interfaces/objects";
import { IThreeBoxUtils, IContextProvider, IConfigProvider } from "@interfaces/utilities";
import { EMessageType } from "@interfaces/types";
import "reflect-metadata";
import { plainToClass, serialize } from "class-transformer";
import { BlockchainUnavailableError, LogicalError, ThreeBoxError } from "@interfaces/objects/errors";
import { ResultUtils } from "@hypernetlabs/utils";
import { errAsync, okAsync } from "neverthrow";
import { BoxSpace, BoxThread } from "3box";

export class ThreeBoxMessagingRepository implements IMessagingRepository {
  protected toThreeboxError: (e: unknown) => ThreeBoxError;
  constructor(
    protected boxUtils: IThreeBoxUtils,
    protected contextProvider: IContextProvider,
    protected configProvider: IConfigProvider,
  ) {
    this.toThreeboxError = (e) => {
      return new ThreeBoxError(e as Error);
    };
  }

  public createMessageThread(
    threadName: string,
    localUser: EthereumAddress,
    remoteUser: EthereumAddress,
  ): ResultAsync<MessageThread, BlockchainUnavailableError | ThreeBoxError> {
    let openThreads: ThreadMetadata[];

    return this.getThreadMetadata()
      .andThen((myOpenThreads) => {
        openThreads = myOpenThreads;
        return this.getExistingThread(openThreads, remoteUser);
      })
      .andThen((existingThread) => {
        if (existingThread != null) {
          return okAsync(existingThread);
        }

        return this._createMessageThread(threadName, localUser, remoteUser, openThreads);
      });
  }

  public getMessageThread(address: string): ResultAsync<MessageThread, BlockchainUnavailableError | ThreeBoxError> {
    // Get the list of open threads
    // Threads exist in the basic hypernet protocol space
    let existingThreadMetadata: ThreadMetadata[];

    return ResultUtils.combine([this.getThreadMetadata(), this.boxUtils.getHypernetProtocolSpace()])
      .andThen((vals) => {
        const [threadMetadata, space] = vals;

        // If the requested thread is not in the list, then that's a problem
        existingThreadMetadata = threadMetadata.filter((val) => {
          return val.address === address;
        });

        if (existingThreadMetadata.length < 1) {
          return errAsync(new LogicalError(`Thread ${address} does not exist!`));
        }

        // Join the thread
        return ResultAsync.fromPromise(space.joinThreadByAddress(address), this.toThreeboxError);
      })
      .andThen((threadUnk) => {
        const thread = threadUnk as BoxThread;
        // Get all the posts in the thread
        const postsResult = ResultAsync.fromPromise(thread.getPosts(), this.toThreeboxError);
        return ResultUtils.combine([postsResult, this.contextProvider.getInitializedContext()]);
      })
      .map((vals) => {
        const [posts, context] = vals;

        // Convert the remaining posts to messages
        const messages = posts.map((post) => {
          // TODO: Determine if we need to convert the message to an object or something else.
          // We might be able to strongly type the data for a Message.
          return new Message(post.author, post.timestamp, post.message);
        });

        return new MessageThread(address, context.account, existingThreadMetadata[0].userAddress, messages);
      });
  }

  public getMessageThreadAddresses(): ResultAsync<string[], BlockchainUnavailableError | ThreeBoxError> {
    // Threads exist in the basic hypernet protocol space
    return this.boxUtils.getHypernetProtocolSpace().andThen((space) => {
      return ResultAsync.fromPromise(space.subscribedThreads(), this.toThreeboxError);
    });
  }

  public sendMessage(
    destination: EthereumAddress,
    payload: MessagePayload,
  ): ResultAsync<void, BlockchainUnavailableError | ThreeBoxError | LogicalError> {
    let threadMetadataToUse: ThreadMetadata;

    // Get the message thread the user wants to use
    return this.getThreadMetadata()
      .andThen((metadata) => {
        const existingThreadMetadata = metadata.filter((val) => {
          return val.userAddress === destination;
        });
        if (existingThreadMetadata.length < 1) {
          return errAsync(new LogicalError(`No existing thread established to reach destination ${destination}`));
        }
        const threadMetadataToUse = existingThreadMetadata[0];
        return this.boxUtils.getThreads([threadMetadataToUse.address]);
      })
      .andThen((threadsUnk) => {
        const threads = threadsUnk as Map<string, BoxThread>;
        const thread = threads.get(threadMetadataToUse.address);

        if (thread == null) {
          return errAsync(
            new LogicalError(`Thread not returned even though it was in the metadata, ${threadMetadataToUse.address}`),
          );
        }

        // Send the payload
        return ResultAsync.fromPromise(thread.post(serialize(payload)), this.toThreeboxError);
      })
      .map(() => {});
  }

  public sendEstablishLinkRequest(
    request: EstablishLinkRequest,
  ): ResultAsync<void, ThreeBoxError | BlockchainUnavailableError> {
    // We just need to post into the discovery thread
    return this.boxUtils
      .getDiscoveryThread()
      .andThen((discoveryThread) => {
        return ResultAsync.fromPromise(discoveryThread.post(serialize(request)), this.toThreeboxError);
      })
      .map(() => {});
  }

  public sendDenyLinkResponse(
    linkRequest: EstablishLinkRequest,
  ): ResultAsync<void, ThreeBoxError | BlockchainUnavailableError> {
    // Get the message thread the user wants to user
    return this.boxUtils
      .getThreads([linkRequest.threadAddress])
      .andThen((threads) => {
        const thread = threads.get(linkRequest.threadAddress);

        if (thread == null) {
          return errAsync(new Error());
        }

        // Send a deny message
        const payload = new MessagePayload(EMessageType.DENY_LINK, serialize(linkRequest));
        return ResultAsync.fromPromise(thread.post(serialize(payload)), this.toThreeboxError);
      })
      .map(() => {});
  }

  public sendControlClaim(controlClaim: ControlClaim): ResultAsync<void, ThreeBoxError | BlockchainUnavailableError> {
    return this.boxUtils
      .getControlThread()
      .andThen((controlThread) => {
        return ResultAsync.fromPromise(controlThread.post(serialize(controlClaim)), this.toThreeboxError);
      })
      .map(() => {});
  }

  protected getExistingThread(
    openThreads: ThreadMetadata[],
    remoteUser: EthereumAddress,
  ): ResultAsync<MessageThread | null, BlockchainUnavailableError | ThreeBoxError> {
    const existingThreads = openThreads.filter((val) => {
      return val.userAddress === remoteUser;
    });

    if (existingThreads.length > 0) {
      // Already have a message thread for this
      return this.getMessageThread(existingThreads[0].address);
    }

    return okAsync(null);
  }

  protected getThreadMetadata(): ResultAsync<ThreadMetadata[], BlockchainUnavailableError | ThreeBoxError> {
    // The thread metadata exists in the basic space
    return ResultUtils.combine([this.boxUtils.getHypernetProtocolSpace(), this.configProvider.getConfig()])
      .andThen((vals) => {
        const [space, config] = vals;

        // Check if we already have a thread created between these two people.

        return ResultAsync.fromPromise(space.private.get(config.openThreadKey), this.toThreeboxError);
      })
      .map((openThreadString) => {
        if (openThreadString == null || openThreadString === "") {
          return [];
        }

        const openThreadObjects = JSON.parse(openThreadString) as object[];

        return openThreadObjects.map((plainLink) => {
          return plainToClass(ThreadMetadata, plainLink);
        });
      });
  }

  protected _createMessageThread(
    threadName: string,
    localUser: EthereumAddress,
    remoteUser: EthereumAddress,
    openThreads: ThreadMetadata[],
  ): ResultAsync<MessageThread, BlockchainUnavailableError | ThreeBoxError> {
    let thread: BoxThread;
    let space: BoxSpace;
    // No existing thread between these two users.
    // We're doing a Members Confidential thread, so other people can't
    // see what we're sending
    return this.boxUtils
      .getHypernetProtocolSpace()
      .andThen((mySpace) => {
        space = mySpace;
        return ResultAsync.fromPromise(space.createConfidentialThread(threadName), this.toThreeboxError);
      })
      .andThen((thread) => {
        // Current user is one part of the thread, need to add the other user
        const addMemberResult = ResultAsync.fromPromise(thread.addMember(remoteUser), this.toThreeboxError);

        return ResultUtils.combine([this.configProvider.getConfig(), addMemberResult]);
      })
      .andThen((vals) => {
        const [config] = vals;

        // Store the new thread metadata
        openThreads.push(new ThreadMetadata(thread.address, remoteUser));
        return ResultAsync.fromPromise(
          space.private.set(config.openThreadKey, serialize(openThreads)),
          this.toThreeboxError,
        );
      })
      .map(() => {
        return new MessageThread(thread.address, localUser, remoteUser, []);
      });
  }
}
