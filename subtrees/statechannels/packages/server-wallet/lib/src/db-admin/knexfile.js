"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
try {
    require('@statechannels/devtools').configureEnvVariables();
}
catch (err) {
    if (/Cannot find module '@statechannels\/devtools'/.test(err.message))
        console.warn(`
WARNING: @statechannels/devtools not detected.
         Ensure required env variables are properly configured in the shell.
    `);
    else
        throw err;
}
const config_1 = require("../config");
const BASE_PATH = path.join(__dirname, '..', 'db');
const extensions = [path.extname(__filename)];
let knexConfig = {
    ...config_1.extractDBConfigFromServerWalletConfig(config_1.defaultConfig),
    debug: config_1.defaultConfig.debugKnex === 'TRUE',
    migrations: {
        directory: path.join(BASE_PATH, 'migrations'),
        loadExtensions: extensions,
    },
    seeds: {
        directory: path.join(BASE_PATH, 'seeds'),
        loadExtensions: extensions,
    },
    postProcessResponse: undefined,
    wrapIdentifier: undefined,
};
if (config_1.defaultConfig.nodeEnv === 'development') {
    knexConfig = { ...knexConfig, pool: { min: 0, max: 1 } };
}
exports.client = knexConfig.client, exports.connection = knexConfig.connection, exports.debug = knexConfig.debug, exports.migrations = knexConfig.migrations, exports.seeds = knexConfig.seeds, exports.pool = knexConfig.pool;
//# sourceMappingURL=knexfile.js.map