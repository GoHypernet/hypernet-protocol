import { Config } from 'knex';
export interface ServerWalletConfig {
    nodeEnv?: 'test' | 'development' | 'production';
    postgresDatabaseUrl?: string;
    postgresHost?: string;
    postgresPort?: string;
    postgresDBName?: string;
    postgresDBUser?: string;
    postgresDBPassword?: string;
    serverSignerPrivateKey: string;
    serverPrivateKey: string;
    rpcEndpoint?: string;
    chainNetworkID: string;
    erc20Address?: string;
    ethAssetHolderAddress?: string;
    erc20AssetHolderAddress?: string;
    debugKnex?: string;
    skipEvmValidation: boolean;
    timingMetrics: boolean;
    metricsOutputFile?: string;
}
export declare const defaultConfig: ServerWalletConfig;
export declare function extractDBConfigFromServerWalletConfig(serverWalletConfig: ServerWalletConfig): Config;
//# sourceMappingURL=config.d.ts.map