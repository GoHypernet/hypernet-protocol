"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objection_1 = require("objection");
const wallet_core_1 = require("@statechannels/wallet-core");
exports.REQUIRED_COLUMNS = {
    channelId: 'channelId',
    amount: 'amount',
    assetHolder: 'assetHolder',
};
class Funding extends objection_1.Model {
    static get idColumn() {
        return ['channelId', 'assetHolder'];
    }
    static async getFundingAmount(knex, channelId, assetHolder) {
        const result = await Funding.query(knex)
            .where({ channelId, assetHolder })
            .first();
        return result ? result.amount : wallet_core_1.Zero;
    }
    static async updateFunding(knex, channelId, amount, assetHolder) {
        const existing = await Funding.query(knex)
            .where({ channelId, assetHolder })
            .first();
        if (!existing) {
            return await Funding.query(knex).insert({ channelId, amount, assetHolder });
        }
        else {
            return await Funding.query(knex)
                .update({ channelId, amount, assetHolder })
                .where({ channelId, assetHolder })
                .returning('*')
                .first();
        }
    }
}
exports.Funding = Funding;
Funding.tableName = 'funding';
//# sourceMappingURL=funding.js.map