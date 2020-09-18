import { Model, TransactionOrKnex } from 'objection';
import { Address, Bytes32, Bytes } from '../type-aliases';
export interface RequiredColumns {
    readonly chainId: Bytes32;
    readonly appDefinition: Address;
    readonly appBytecode: Bytes;
}
export declare class AppBytecode extends Model implements RequiredColumns {
    readonly chainId: Bytes32;
    readonly appDefinition: Address;
    readonly appBytecode: Bytes;
    static tableName: string;
    static get idColumn(): string[];
    static getBytecode(chainId: Bytes32, appDefinition: Address, txOrKnex: TransactionOrKnex): Promise<Bytes | undefined>;
}
//# sourceMappingURL=app-bytecode.d.ts.map