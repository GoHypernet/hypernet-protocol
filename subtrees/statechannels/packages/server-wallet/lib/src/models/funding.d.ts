import { Model } from 'objection';
import Knex from 'knex';
import { Uint256, Bytes32, Address } from '../type-aliases';
export declare const REQUIRED_COLUMNS: {
    channelId: string;
    amount: string;
    assetHolder: string;
};
export interface RequiredColumns {
    readonly channelId: Bytes32;
    readonly amount: Uint256;
    readonly assetHolder: Address;
}
export declare class Funding extends Model implements RequiredColumns {
    static tableName: string;
    static get idColumn(): string[];
    readonly channelId: Bytes32;
    readonly amount: Uint256;
    readonly assetHolder: Address;
    static getFundingAmount(knex: Knex, channelId: Bytes32, assetHolder: Address): Promise<Uint256>;
    static updateFunding(knex: Knex, channelId: Bytes32, amount: Uint256, assetHolder: Address): Promise<Funding>;
}
//# sourceMappingURL=funding.d.ts.map