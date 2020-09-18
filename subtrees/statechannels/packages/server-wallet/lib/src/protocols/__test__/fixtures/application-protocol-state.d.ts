import { StateVariables } from '@statechannels/wallet-core';
import { Fixture } from '../../../wallet/__test__/fixtures/utils';
import { ProtocolState } from '../../application';
export declare const applicationProtocolState: Fixture<{
    app: import("../../state").ChannelState;
}>;
export declare const withSupportedState: (vars: Partial<StateVariables>) => Fixture<ProtocolState>;
//# sourceMappingURL=application-protocol-state.d.ts.map