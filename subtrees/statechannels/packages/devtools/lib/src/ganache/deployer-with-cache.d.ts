import { CompiledContract } from 'etherlime-lib';
import { GanacheDeployer } from './deployer';
export declare class GanacheNCacheDeployer {
    readonly port: number;
    readonly deploymentsPath: string;
    deployer: GanacheDeployer;
    constructor(port: number, deploymentsPath: string, privateKey?: string);
    get etherlimeDeployer(): import("etherlime-lib/dist/deployer/etherlime-ganache-deployer/etherlime-ganache-deployer").default;
    deploy(contract: CompiledContract, libraries?: Record<string, string>, ...args: any[]): Promise<string>;
    private addToCache;
    private findDeployment;
    private addressFromCache;
    private loadDeployments;
}
//# sourceMappingURL=deployer-with-cache.d.ts.map