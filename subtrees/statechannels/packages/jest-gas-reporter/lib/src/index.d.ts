import { utils, providers } from 'ethers';
import { Config } from '@jest/types';
import { Reporter } from '@jest/reporters';
import easyTable from 'easy-table';
interface MethodCalls {
    [methodName: string]: {
        gasData: number[];
        calls: number;
    };
}
interface ContractCalls {
    [contractName: string]: {
        interface: utils.Interface;
        address?: string;
        code: string;
        methodCalls: MethodCalls;
        deploy?: {
            gasData: number[];
            calls: number;
        };
    };
}
interface Options {
    contractArtifactFolder: string;
}
interface ParsedArtifact {
    abi: (string | utils.FunctionFragment | utils.EventFragment)[];
    deployedBytecode: object;
    contractName: string;
    networks: {
        [networkName: string]: {
            address: string;
        };
    };
}
interface GasConsumed {
    [contract: string]: ContractStats;
}
interface ContractStats {
    deployment: number;
    methods: {
        [method: string]: Stats;
    };
}
interface Stats {
    calls: number;
    min: number;
    max: number;
    avg: number;
}
export declare class GasReporter implements Reporter {
    options: Options;
    provider: providers.JsonRpcProvider;
    globalConfig: Config.GlobalConfig;
    startBlockNum: number;
    constructor(globalConfig: Config.GlobalConfig, options: Options);
    onTestStart(): void;
    getLastError(): void;
    onTestResult(): void;
    onRunStart(): void;
    onRunComplete(): Promise<void>;
    generateFinalResults(): Promise<void>;
    parseContractCalls(startBlockNum: number, endBlockNum: number, contractFolder: string): Promise<ContractCalls>;
    parseContractArtifactFolder(contractFolder: string, networkId: number): ContractCalls;
    parseCode(parsedArtifact: ParsedArtifact, contractCalls: ContractCalls): void;
    parseInterfaceAndAddress(parsedArtifact: ParsedArtifact, networkId: number, contractCalls: ContractCalls): void;
    outputGasInfo(contractCalls: ContractCalls): void;
    objectToEasyTable(gasConsumed: GasConsumed, markdown: boolean): easyTable;
    parseBlock(blockNum: number, contractCalls: ContractCalls): Promise<void>;
    saveResultsToFile(hash: string): Promise<void>;
}
export {};
//# sourceMappingURL=index.d.ts.map