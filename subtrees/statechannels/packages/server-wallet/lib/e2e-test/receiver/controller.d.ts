import { Message } from '@statechannels/wallet-core';
import { Participant } from '@statechannels/client-api-schema';
export default class ReceiverController {
    private readonly wallet;
    private readonly myParticipantID;
    private time;
    get participantInfo(): Participant;
    acceptMessageAndReturnReplies(message: Message): Promise<Message>;
}
//# sourceMappingURL=controller.d.ts.map