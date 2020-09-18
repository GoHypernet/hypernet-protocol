import { Account } from '../types';
import { GanacheDeployer } from './deployer';
import { GanacheNCacheDeployer } from './deployer-with-cache';
import { GanacheServer } from './server';
export declare const ganacheIsRunning: (port: number) => Promise<boolean>;
interface SharedReturnType {
    deployer: GanacheNCacheDeployer;
    type: 'shared';
}
interface IndividualReturnType {
    deployer: GanacheDeployer;
    server: GanacheServer;
    type: 'individual';
}
export declare const setupGanache: (deployerAccountIndex: string | number) => Promise<SharedReturnType | IndividualReturnType>;
interface Params {
    port: number;
    chainId: number;
    accounts: Account[];
    timeout: number;
    gasLimit: number;
    gasPrice: string;
}
export declare function startSharedGanache(deploymentsPath: string, p?: Partial<Params>): Promise<GanacheServer | undefined>;
export {};
//# sourceMappingURL=index.d.ts.map