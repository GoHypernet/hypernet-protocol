import { SignedState as SignedStateWire, Message as WireMessage } from '@statechannels/wire-format';
import { SignedState, Message } from '../../types';
export declare function serializeMessage(message: Message, recipient: string, sender: string): WireMessage;
export declare function serializeState(state: SignedState): SignedStateWire;
//# sourceMappingURL=serialize.d.ts.map