"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const config_1 = require("../config");
const knexConfig = __importStar(require("./knexfile"));
exports.default = knex_1.default(knexConfig);
exports.truncate = async (knex, tables = ['signing_wallets', 'channels', 'nonces']) => {
    if (config_1.defaultConfig.nodeEnv !== 'development' && config_1.defaultConfig.nodeEnv !== 'test') {
        throw 'No admin connection allowed';
    }
    await Promise.all(tables.map(table => knex.raw(`TRUNCATE TABLE ${table} CASCADE;`)));
};
//# sourceMappingURL=db-admin-connection.js.map