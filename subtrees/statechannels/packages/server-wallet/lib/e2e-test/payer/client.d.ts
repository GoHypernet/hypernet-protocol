import { ChannelResult, Participant } from '@statechannels/client-api-schema';
import { Message } from '@statechannels/wallet-core';
import { Bytes32, Address } from '../../src/type-aliases';
export default class PayerClient {
    private readonly pk;
    private readonly receiverHttpServerURL;
    private readonly wallet;
    destroy(): Promise<void>;
    private time;
    constructor(pk: Bytes32, receiverHttpServerURL: string);
    readonly participantId = "payer";
    get address(): Address;
    get destination(): Address;
    get me(): Participant;
    getReceiversParticipantInfo(): Promise<Participant>;
    getChannel(channelId: string): Promise<ChannelResult>;
    getChannels(): Promise<ChannelResult[]>;
    createPayerChannel(receiver: Participant): Promise<ChannelResult>;
    makePayment(channelId: string): Promise<void>;
    emptyMessage(): Promise<Message>;
    private messageReceiverAndExpectReply;
}
//# sourceMappingURL=client.d.ts.map