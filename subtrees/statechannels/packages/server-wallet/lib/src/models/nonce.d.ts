import Knex from 'knex';
import { JSONSchema, Model, Pojo, ModelOptions } from 'objection';
import { Address, Uint48 } from '../type-aliases';
export declare class Nonce extends Model {
    readonly id: number;
    readonly addresses: Address[];
    readonly value: Uint48;
    static tableName: string;
    static get jsonSchema(): JSONSchema;
    $beforeValidate(jsonSchema: JSONSchema, json: Pojo, _opt: ModelOptions): Pojo;
    static next(knex: Knex, addresses: Address[]): Promise<number>;
    use(knex: Knex): Promise<void>;
}
//# sourceMappingURL=nonce.d.ts.map