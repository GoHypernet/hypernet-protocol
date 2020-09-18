import { IFrameChannelProviderInterface } from '@statechannels/iframe-channel-provider';
import { FakeBrowserChannelProvider } from './fake-browser-channel-provider';
/**
 * Adds to the browser channel provider the mountWalletComponent which is specifically
 * useful in the context where the wallet is embedded inside the DOM of the application
 * via an iFrame.
 */
export declare class FakeIFrameChannelProvider extends FakeBrowserChannelProvider implements IFrameChannelProviderInterface {
    mountWalletComponent(url?: string): Promise<void>;
}
//# sourceMappingURL=fake-iframe-channel-provider.d.ts.map