"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const constants_1 = require("../constants");
const bignumber_1 = require("../bignumber");
function assetHolderAddress(tokenAddress) {
    if (bignumber_1.BN.isZero(tokenAddress))
        return config_1.ETH_ASSET_HOLDER_ADDRESS;
    else if (tokenAddress === constants_1.MOCK_TOKEN)
        return constants_1.MOCK_ASSET_HOLDER_ADDRESS;
    throw 'AssetHolderAddress not found';
}
exports.assetHolderAddress = assetHolderAddress;
function tokenAddress(assetHolderAddress) {
    if (assetHolderAddress === config_1.ETH_ASSET_HOLDER_ADDRESS)
        return constants_1.ETH_TOKEN;
    else if (assetHolderAddress === constants_1.MOCK_ASSET_HOLDER_ADDRESS)
        return constants_1.MOCK_TOKEN;
    throw 'TokenAddress not found';
}
exports.tokenAddress = tokenAddress;
//# sourceMappingURL=contract-utils.js.map