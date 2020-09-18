"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const devtools_1 = require("@statechannels/devtools");
process.on('SIGINT', () => {
    server.close();
    process.exit(0);
});
process.on('SIGTERM', () => {
    server.close();
    process.exit(0);
});
devtools_1.configureEnvVariables();
const app_1 = __importDefault(require("./app"));
const server = app_1.default.listen(65535, '127.0.0.1');
app_1.default.on('listening', () => {
    console.info('[receiver] Listening on 127.0.0.1:65535');
});
//# sourceMappingURL=server.js.map