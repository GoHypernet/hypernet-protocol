"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const config_1 = require("./config");
const LOG_TO_CONSOLE = config_1.LOG_DESTINATION === 'console';
const LOG_TO_FILE = config_1.ADD_LOGS && !LOG_TO_CONSOLE;
const name = 'ganache-cli';
const destination = LOG_TO_FILE ? pino_1.default.destination(config_1.LOG_DESTINATION) : undefined;
const prettyPrint = LOG_TO_CONSOLE ? { translateTime: true } : false;
const opts = { name, prettyPrint, level: config_1.LOG_LEVEL };
exports.logger = destination ? pino_1.default(opts, destination) : pino_1.default(opts);
//# sourceMappingURL=logger.js.map