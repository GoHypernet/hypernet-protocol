"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@ethersproject/constants");
const _ = require("lodash");
const config_1 = require("../config");
const helpers_1 = require("./helpers");
function ethBudget(domain, opts) {
    return {
        domain,
        hubAddress: config_1.HUB_ADDRESS,
        forAsset: {
            [config_1.ETH_ASSET_HOLDER_ADDRESS]: _.assign({
                assetHolderAddress: config_1.ETH_ASSET_HOLDER_ADDRESS,
                availableReceiveCapacity: constants_1.Zero,
                availableSendCapacity: constants_1.Zero,
                channels: {}
            }, opts)
        }
    };
}
exports.ethBudget = ethBudget;
function forEthAsset(budget) {
    const ethPart = budget.forAsset[config_1.ETH_ASSET_HOLDER_ADDRESS];
    if (!ethPart)
        throw 'No eth part!';
    return ethPart;
}
exports.forEthAsset = forEthAsset;
function extractEthAssetBudget(budget) {
    if (Object.keys(budget.forAsset).length !== 1) {
        throw new Error('Cannot handle mixed budget');
    }
    return helpers_1.checkThat(budget.forAsset[config_1.ETH_ASSET_HOLDER_ADDRESS], helpers_1.exists);
}
exports.extractEthAssetBudget = extractEthAssetBudget;
//# sourceMappingURL=budget-utils.js.map