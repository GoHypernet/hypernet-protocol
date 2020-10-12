"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var ETHAssetHolder_json_1 = __importDefault(require("../../../build/contracts/ETHAssetHolder.json"));
var assetHolderTransactionCreator = __importStar(require("./asset-holder"));
var EthAssetHolderContractInterface = new ethers_1.ethers.utils.Interface(ETHAssetHolder_json_1.default.abi);
function createTransferAllTransaction(channelId, allocation) {
    return assetHolderTransactionCreator.createTransferAllTransaction(EthAssetHolderContractInterface, channelId, allocation);
}
exports.createTransferAllTransaction = createTransferAllTransaction;
function createClaimAllTransaction(channelId, guarantee, allocation) {
    return assetHolderTransactionCreator.createClaimAllTransaction(EthAssetHolderContractInterface, channelId, guarantee, allocation);
}
exports.createClaimAllTransaction = createClaimAllTransaction;
function createSetOutcomeTransaction(channelId, outcome) {
    return assetHolderTransactionCreator.createSetOutcomeTransaction(EthAssetHolderContractInterface, channelId, outcome);
}
exports.createSetOutcomeTransaction = createSetOutcomeTransaction;
function createDepositTransaction(destination, expectedHeld, amount) {
    var data = EthAssetHolderContractInterface.functions.deposit.encode([
        destination,
        expectedHeld,
        amount,
    ]);
    return { data: data };
}
exports.createDepositTransaction = createDepositTransaction;
//# sourceMappingURL=eth-asset-holder.js.map