"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
var channel_client_1 = require("./channel-client");
exports.ChannelClient = channel_client_1.ChannelClient;
var fake_browser_channel_provider_1 = require("../tests/fakes/fake-browser-channel-provider");
exports.FakeBrowserChannelProvider = fake_browser_channel_provider_1.FakeBrowserChannelProvider;
var fake_channel_provider_1 = require("../tests/fakes/fake-channel-provider");
exports.FakeChannelProvider = fake_channel_provider_1.FakeChannelProvider;
/**
 * @beta
 */
const UserDeclinedErrorCode = types_1.ErrorCode.CloseAndWithdraw.UserDeclined;
exports.UserDeclinedErrorCode = UserDeclinedErrorCode;
/**
 * @beta
 */
const EthereumNotEnabledErrorCode = types_1.ErrorCode.EnableEthereum.EthereumNotEnabled;
exports.EthereumNotEnabledErrorCode = EthereumNotEnabledErrorCode;
var types_2 = require("./types");
exports.ErrorCode = types_2.ErrorCode;
//# sourceMappingURL=index.js.map