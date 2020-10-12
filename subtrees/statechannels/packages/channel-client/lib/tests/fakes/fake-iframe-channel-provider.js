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
const fake_browser_channel_provider_1 = require("./fake-browser-channel-provider");
/**
 * Adds to the browser channel provider the mountWalletComponent which is specifically
 * useful in the context where the wallet is embedded inside the DOM of the application
 * via an iFrame.
 */
class FakeIFrameChannelProvider extends fake_browser_channel_provider_1.FakeBrowserChannelProvider {
    mountWalletComponent(url) {
        return __awaiter(this, void 0, void 0, function* () {
            this.url = url || '';
            this.signingAddress = this.getAddress();
            this.walletVersion = 'FakeChannelProvider@VersionTBD';
            this.destinationAddress = '0xEthereumAddress';
        });
    }
}
exports.FakeIFrameChannelProvider = FakeIFrameChannelProvider;
//# sourceMappingURL=fake-iframe-channel-provider.js.map