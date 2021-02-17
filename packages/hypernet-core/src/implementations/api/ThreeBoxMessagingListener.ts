import { IMessagingListener } from "@interfaces/api";
import { BoxThread } from "3box";
import { IConfigProvider, IContextProvider, IThreeBoxUtils } from "@interfaces/utilities";
import "reflect-metadata";
import { plainToClass } from "class-transformer";
import { IControlService } from "@interfaces/business";
import { BlockchainUnavailableError, ThreeBoxError } from "@interfaces/objects/errors";
import { ControlClaim, ResultAsync } from "@interfaces/objects";
import {ResultUtils} from "@hypernetlabs/utils";

export class ThreeBoxMessagingListener implements IMessagingListener {
  constructor(
    protected controlService: IControlService,
    protected boxUtils: IThreeBoxUtils,
    protected configProvider: IConfigProvider,
    protected contextProvider: IContextProvider,
  ) {}

  public initialize(): ResultAsync<void, ThreeBoxError | BlockchainUnavailableError> {
    let controlThread: BoxThread;
    let did: string;

    return ResultUtils.combine([this.boxUtils.getControlThread(), this.boxUtils.getDID()]).map((vals) => {
      [controlThread, did] = vals;

      controlThread.onUpdate(async (post) => {
        // Discard posts that we sent
        if (post.author === did || post.type === "backlog") {
          return;
        }
        // In the control thread, all posts should be the same format
        const plain = JSON.parse(post.message) as object;
        const controlClaim = plainToClass(ControlClaim, plain);
        this.controlService.processControlClaim(controlClaim);
      });
    });
  }
}

// we need to process any messages that may have occured while we
// were gone.
// return ResultAsync.fromPromise(discoveryThread.getPosts(), this.toThreeboxError);
//   })
//   .andThen((posts) => {
// const linkRequests = posts
//   .filter((post) => {
//     // Discard posts that we sent
//     if (post.author === did) {
//       console.log("Discarding message sent by us", post.author);
//       return false;
//     }
//     return true;
//   })
//   .map((post) => {
//     // In the discovery thread, all posts should be the same format
//     const plain = JSON.parse(post.message) as object;
//     return plainToClass(EstablishLinkRequest, plain);
//   });
// returnthis.linkService.processEstablishLinkRequests(linkRequests);

// discoveryThread.onUpdate(async (post) => {
//   // Discard posts that we sent
//   if (post.author === did || post.type === "backlog") {
//     console.log("Discarding message sent by us", post.author);
//     return;
//   }
//   // In the discovery thread, all posts should be the same format
//   const plain = JSON.parse(post.message) as object;
//   const linkRequest = plainToClass(EstablishLinkRequest, plain);
//   this.linkService.processEstablishLinkRequests([linkRequest]);
// });

// // For each open link, we need to join the thread
// const links = await this.linkService.getActiveLinks();
// // Map to just the thread addresses
// const threadAddresses = links
//   .filter((val) => {
//     return val.threadAddress != null;
//   })
//   .map((val) => {
//     return val.threadAddress;
//   }) as string[];
// // Get all the threads
// const threads = await this.boxUtils.getThreads(threadAddresses);
// for (const [, thread] of Object.entries(threads)) {
//   thread.onUpdate(async (post: BoxThreadPost) => {
//     const plain = JSON.parse(post.message) as object;
//     const message = plainToClass(MessagePayload, plain);
//     this.messageService.messageRecieved(message);
//   });
// }

// The control thread is pretty easy. We don't actually care what's in it,
// we're just going to post that we've arrived, and listen for if anybody
// else has arrived.
