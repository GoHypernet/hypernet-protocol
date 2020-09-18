import { Address } from '@statechannels/client-api-schema';
export declare type TestNetworkContext = {
    ETH_ASSET_HOLDER_ADDRESS: Address;
    ERC20_ADDRESS: Address;
    ERC20_ASSET_HOLDER_ADDRESS: Address;
    NITRO_ADJUDICATOR_ADDRESS: Address;
};
export declare function deploy(): Promise<TestNetworkContext>;
//# sourceMappingURL=deploy.d.ts.map