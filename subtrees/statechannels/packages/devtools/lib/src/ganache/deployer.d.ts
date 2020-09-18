import { CompiledContract, EtherlimeGanacheDeployer } from 'etherlime-lib';
export declare class GanacheDeployer {
    etherlimeDeployer: EtherlimeGanacheDeployer;
    constructor(port: number, privateKey?: string);
    deploy(contract: CompiledContract, libraries?: Record<string, string>, ...args: any[]): Promise<string>;
}
//# sourceMappingURL=deployer.d.ts.map