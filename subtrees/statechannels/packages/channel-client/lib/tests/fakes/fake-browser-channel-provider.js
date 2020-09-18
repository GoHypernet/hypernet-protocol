"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fake_channel_provider_1 = require("./fake-channel-provider");
const mockDomainBudget = {
    hubAddress: 'mock.hub.com',
    domain: 'mock.web3torrent.com',
    budgets: [
        {
            token: '0x00',
            availableReceiveCapacity: '0x5000000',
            availableSendCapacity: '0x3000000',
            channels: []
        }
    ]
};
/**
 * Extension of FakeChannelProvider which adds support for browser-specific wallet API
 * methods such as EnableEthereum and ApproveBudgetAndFund. Also, exposes the browser
 * specific provider method enable() (i.e., for MetaMask approval).
 */
/**
 * @beta
 */
class FakeBrowserChannelProvider extends fake_channel_provider_1.FakeChannelProvider {
    constructor() {
        super(...arguments);
        this.budget = mockDomainBudget;
    }
    mountWalletComponent(url) {
        return __awaiter(this, void 0, void 0, function* () {
            this.url = url || '';
            this.signingAddress = this.getAddress();
            this.walletVersion = 'FakeChannelProvider@VersionTBD';
            this.destinationAddress = '0xEthereumAddress';
        });
    }
    enable() {
        return __awaiter(this, void 0, void 0, function* () {
            const { signingAddress, destinationAddress, walletVersion } = yield this.send('EnableEthereum', {});
            this.signingAddress = signingAddress;
            this.destinationAddress = destinationAddress;
            this.walletVersion = walletVersion;
        });
    }
    send(method, params) {
        const _super = Object.create(null, {
            send: { get: () => super.send }
        });
        return __awaiter(this, void 0, void 0, function* () {
            switch (method) {
                case 'EnableEthereum':
                    return {
                        signingAddress: this.getAddress(),
                        destinationAddress: '0xEthereumAddress',
                        walletVersion: 'FakeChannelProvider@VersionTBD'
                    };
                case 'ApproveBudgetAndFund':
                    return this.approveBudgetAndFund(params);
                case 'CloseAndWithdraw':
                    return this.closeAndWithdraw(params);
                case 'GetBudget':
                    return this.getBudget(params);
                default:
                    return _super.send.call(this, method, params);
            }
        });
    }
    notifyAppBudgetUpdated(data) {
        this.events.emit('BudgetUpdated', data);
    }
    approveBudgetAndFund(params) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Does this need to be delayed?
            this.budget = {
                hubAddress: params.hub.signingAddress,
                domain: 'localhost',
                budgets: [
                    {
                        token: '0x00',
                        availableReceiveCapacity: params.requestedReceiveCapacity,
                        availableSendCapacity: params.requestedSendCapacity,
                        channels: []
                    }
                ]
            };
            this.notifyAppBudgetUpdated(this.budget);
            return this.budget;
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    closeAndWithdraw(_params) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Implement a fake implementation
            return { success: true };
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getBudget(_params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.budget;
        });
    }
}
exports.FakeBrowserChannelProvider = FakeBrowserChannelProvider;
//# sourceMappingURL=fake-browser-channel-provider.js.map