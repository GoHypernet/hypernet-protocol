import { JSONSchema, Model, Pojo, ModelOptions } from 'objection';
import { SignatureEntry, State, StateWithHash } from '@statechannels/wallet-core';
import { Address, Bytes32 } from '../type-aliases';
export declare class SigningWallet extends Model {
    readonly id: number;
    readonly privateKey: Bytes32;
    readonly address: Address;
    static tableName: string;
    $beforeValidate(jsonSchema: JSONSchema, json: Pojo, _opt: ModelOptions): JSONSchema;
    $validate(json: Pojo): Pojo;
    syncSignState(state: State): SignatureEntry;
    signState(state: StateWithHash): Promise<SignatureEntry>;
}
//# sourceMappingURL=signing-wallet.d.ts.map