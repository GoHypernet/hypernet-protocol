/**
 * @packageDocumentation Make requests to a statechannels wallet using async methods
 *
 * @remarks
 * The {@link @statechannels/channel-client#ChannelClient | ChannelClient} class wraps an object implementing the {@link @statechannels/iframe-channel-provider#ChannelProviderInterface | Channel Provider Interface} and exposes methods which return Promises. This object could be a {@link @statechannels/channel-client#FakeChannelProvider | Fake Channel Provider}.
 */
export { ChannelResult } from '@statechannels/client-api-schema';
export { UnsubscribeFunction, TokenAllocations, BrowserChannelClientInterface, ChannelClientInterface } from './types';
export { ChannelClient } from './channel-client';
export { FakeBrowserChannelProvider } from '../tests/fakes/fake-browser-channel-provider';
export { FakeChannelProvider } from '../tests/fakes/fake-channel-provider';
/**
 * @beta
 */
declare const UserDeclinedErrorCode: 200;
/**
 * @beta
 */
declare const EthereumNotEnabledErrorCode: 100;
export { EthereumNotEnabledErrorCode, UserDeclinedErrorCode };
export { ErrorCode } from './types';
//# sourceMappingURL=index.d.ts.map