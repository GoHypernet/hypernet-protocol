"use strict";
/**
 * @packageDocumentation Communicate with a statechannels wallet via JSON-RPC over postMessage
 *
 * @remarks
 * Attaches a channelProvider to the window object.
 */
// Anything exported by this file will be exposed to `window`.
Object.defineProperty(exports, "__esModule", { value: true });
var channel_provider_1 = require("./channel-provider");
exports.channelProvider = channel_provider_1.channelProvider;
exports.IFrameChannelProvider = channel_provider_1.IFrameChannelProvider;
//# sourceMappingURL=index.js.map