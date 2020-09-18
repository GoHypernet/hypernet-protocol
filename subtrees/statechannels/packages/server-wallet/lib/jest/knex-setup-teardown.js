"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const devtools_1 = require("@statechannels/devtools");
const knex_1 = __importDefault(require("knex"));
devtools_1.configureEnvVariables();
const db_admin_connection_1 = __importDefault(require("../src/db-admin/db-admin-connection"));
const config_1 = require("../src/config");
beforeAll(async () => {
    exports.testKnex = knex_1.default(config_1.extractDBConfigFromServerWalletConfig(config_1.defaultConfig));
    await db_admin_connection_1.default.migrate.rollback();
    await db_admin_connection_1.default.migrate.latest();
});
afterEach(async () => {
    await db_admin_connection_1.default.raw('TRUNCATE TABLE channels RESTART IDENTITY CASCADE');
});
afterAll(async () => {
    await db_admin_connection_1.default.destroy();
    await exports.testKnex.destroy();
});
//# sourceMappingURL=knex-setup-teardown.js.map