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
var ERC20AssetHolder_json_1 = __importDefault(require("../../../build/contracts/ERC20AssetHolder.json"));
var assetHolderTransactionCreator = __importStar(require("./asset-holder"));
var Erc20AssetHolderContractInterface = new ethers_1.ethers.utils.Interface(ERC20AssetHolder_json_1.default.abi);
function createTransferAllTransaction(channelId, allocation) {
    return assetHolderTransactionCreator.createTransferAllTransaction(Erc20AssetHolderContractInterface, channelId, allocation);
}
exports.createTransferAllTransaction = createTransferAllTransaction;
function createClaimAllTransaction(channelId, guarantee, allocation) {
    return assetHolderTransactionCreator.createClaimAllTransaction(Erc20AssetHolderContractInterface, channelId, guarantee, allocation);
}
exports.createClaimAllTransaction = createClaimAllTransaction;
function createSetOutcomeTransaction(channelId, outcome) {
    return assetHolderTransactionCreator.createSetOutcomeTransaction(Erc20AssetHolderContractInterface, channelId, outcome);
}
exports.createSetOutcomeTransaction = createSetOutcomeTransaction;
function createDepositTransaction(destination, expectedHeld, amount) {
    var data = Erc20AssetHolderContractInterface.functions.deposit.encode([
        destination,
        expectedHeld,
        amount,
    ]);
    return { data: data };
}
exports.createDepositTransaction = createDepositTransaction;
//# sourceMappingURL=erc20-asset-holder.js.map