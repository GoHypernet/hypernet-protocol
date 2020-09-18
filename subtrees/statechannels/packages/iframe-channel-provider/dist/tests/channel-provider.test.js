"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var channel_provider_1 = require("../src/channel-provider");
describe('ChannelProvider', function () {
    it('can be be connected to a wallet', function () {
        var onMessageSpy = jest.spyOn(window, 'addEventListener');
        channel_provider_1.channelProvider.mountWalletComponent('www.test.com');
        expect(onMessageSpy).toHaveBeenCalled();
    });
});
//# sourceMappingURL=channel-provider.test.js.map