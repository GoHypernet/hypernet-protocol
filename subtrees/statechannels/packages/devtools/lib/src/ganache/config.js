"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../config/env");
env_1.configureEnvVariables();
exports.SHOW_VERBOSE_GANACHE_OUTPUT = process.env.SHOW_VERBOSE_GANACHE_OUTPUT === 'true';
exports.SHOW_GANACHE_OUTPUT = exports.SHOW_VERBOSE_GANACHE_OUTPUT || process.env.SHOW_GANACHE_OUTPUT == 'true';
exports.LOG_DESTINATION = process.env.GANACHE_LOG_DESTINATION || 'console';
exports.ADD_LOGS = exports.SHOW_VERBOSE_GANACHE_OUTPUT || exports.SHOW_GANACHE_OUTPUT;
exports.LOG_LEVEL = exports.ADD_LOGS ? process.env.LOG_LEVEL || 'info' : 'silent';
exports.LOG_TO_CONSOLE = exports.LOG_DESTINATION === 'console';
exports.LOG_TO_FILE = exports.ADD_LOGS && !exports.LOG_TO_CONSOLE;
//# sourceMappingURL=config.js.map