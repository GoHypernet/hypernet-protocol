"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
exports.defaultConfig = {
    nodeEnv: process.env.NODE_ENV,
    postgresDatabaseUrl: process.env.SERVER_URL,
    postgresHost: process.env.SERVER_HOST,
    postgresPort: process.env.SERVER_PORT,
    postgresDBName: process.env.SERVER_DB_NAME,
    postgresDBUser: process.env.SERVER_DB_USER,
    postgresDBPassword: process.env.SERVER_DB_PASSWORD,
    serverSignerPrivateKey: process.env.SERVER_SIGNER_PRIVATE_KEY ||
        '0x7ab741b57e8d94dd7e1a29055646bafde7010f38a900f55bbd7647880faa6ee8',
    serverPrivateKey: process.env.SERVER_PRIVATE_KEY ||
        '0x1b427b7ab88e2e10674b5aa92bb63c0ca26aa0b5a858e1d17295db6ad91c049b',
    rpcEndpoint: process.env.RPC_ENDPOINT,
    chainNetworkID: process.env.CHAIN_NETWORK_ID || '0x00',
    ethAssetHolderAddress: process.env.ETH_ASSET_HOLDER_ADDRESS,
    erc20Address: process.env.ERC20_ADDRESS,
    erc20AssetHolderAddress: process.env.ERC20_ASSET_HOLDER_ADDRESS,
    debugKnex: process.env.DEBUG_KNEX,
    skipEvmValidation: (process.env.SKIP_EVM_VALIDATION || 'false').toLowerCase() === 'true',
    timingMetrics: process.env.TIMING_METRICS === 'ON',
    metricsOutputFile: process.env.METRICS_OUTPUT_FILE,
};
function extractDBConfigFromServerWalletConfig(serverWalletConfig) {
    return {
        client: 'postgres',
        connection: serverWalletConfig.postgresDatabaseUrl || {
            host: serverWalletConfig.postgresHost,
            port: Number(serverWalletConfig.postgresPort),
            database: serverWalletConfig.postgresDBName,
            user: serverWalletConfig.postgresDBUser,
            password: serverWalletConfig.postgresDBPassword,
        },
        ...objection_1.knexSnakeCaseMappers(),
    };
}
exports.extractDBConfigFromServerWalletConfig = extractDBConfigFromServerWalletConfig;
//# sourceMappingURL=config.js.map