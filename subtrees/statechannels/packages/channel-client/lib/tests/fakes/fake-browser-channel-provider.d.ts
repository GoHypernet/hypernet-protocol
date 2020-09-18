import { WalletJsonRpcAPI, IFrameChannelProviderInterface } from '@statechannels/iframe-channel-provider';
import { ApproveBudgetAndFundParams, CloseAndWithdrawParams, GetBudgetParams, DomainBudget } from '@statechannels/client-api-schema';
import { FakeChannelProvider } from './fake-channel-provider';
/**
 * Extension of FakeChannelProvider which adds support for browser-specific wallet API
 * methods such as EnableEthereum and ApproveBudgetAndFund. Also, exposes the browser
 * specific provider method enable() (i.e., for MetaMask approval).
 */
/**
 * @beta
 */
export declare class FakeBrowserChannelProvider extends FakeChannelProvider implements IFrameChannelProviderInterface {
    budget: DomainBudget;
    mountWalletComponent(url?: string): Promise<void>;
    enable(): Promise<void>;
    send<M extends keyof WalletJsonRpcAPI>(method: M, params: WalletJsonRpcAPI[M]['request']['params']): Promise<WalletJsonRpcAPI[M]['response']['result']>;
    notifyAppBudgetUpdated(data: DomainBudget): void;
    approveBudgetAndFund(params: ApproveBudgetAndFundParams): Promise<DomainBudget>;
    closeAndWithdraw(_params: CloseAndWithdrawParams): Promise<{
        success: boolean;
    }>;
    getBudget(_params: GetBudgetParams): Promise<DomainBudget>;
}
//# sourceMappingURL=fake-browser-channel-provider.d.ts.map