import { ethers } from 'ethers';
import { Account, DeployedArtifacts, Deployment } from '../types';
export declare class GanacheServer {
    readonly port: number;
    readonly chainId: number;
    readonly timeout: number;
    provider: ethers.providers.JsonRpcProvider;
    fundedPrivateKey: string;
    server: any;
    private buffer;
    constructor(port?: number, chainId?: number, accounts?: Account[], timeout?: number, gasLimit?: number, gasPrice?: number);
    static connect(port: number): Promise<GanacheServer>;
    ready(): Promise<void>;
    close(): Promise<void>;
    onClose(listener: () => void): void;
    deployContracts(deployments: (Deployment | any)[]): Promise<DeployedArtifacts>;
}
//# sourceMappingURL=server.d.ts.map