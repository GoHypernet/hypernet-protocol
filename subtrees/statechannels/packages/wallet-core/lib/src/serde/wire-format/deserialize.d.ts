import { SignedState as SignedStateWire, Objective as ObjectiveWire, Message as WireMessage } from '@statechannels/wire-format';
import { SignedState, Message, Objective, Participant } from '../../types';
export declare function convertToInternalParticipant(participant: {
    destination: string;
    signingAddress: string;
    participantId: string;
}): Participant;
export declare function deserializeMessage(message: WireMessage): Message;
export declare function deserializeState(state: SignedStateWire): SignedState;
export declare function deserializeObjective(objective: ObjectiveWire): Objective;
//# sourceMappingURL=deserialize.d.ts.map