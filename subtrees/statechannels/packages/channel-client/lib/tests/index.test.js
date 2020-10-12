"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channel_client_1 = require("../src/channel-client");
// TODO: Figure out how to test
describe('ChannelClient', () => {
    it('instantiates', () => {
        expect(new channel_client_1.ChannelClient({
            enable: () => {
                /* do nothing */
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            on: (_method, _callback) => {
                /* do nothing */
            }
        })).toBeDefined();
    });
});
//# sourceMappingURL=index.test.js.map