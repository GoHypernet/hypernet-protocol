import ethers from 'ethers';
export declare function getGanacheProvider(): ethers.ethers.providers.JsonRpcProvider;
export declare function getPrivateKeyWithEth(): string;
export declare function getWalletWithEthAndProvider(): ethers.ethers.Wallet;
export declare function getNetworkId(): Promise<number>;
export declare function getNetworkName(networkId: string | number): "live" | "ropsten" | "rinkeby" | "goerli" | "kovan" | "development";
//# sourceMappingURL=network-setup.d.ts.map