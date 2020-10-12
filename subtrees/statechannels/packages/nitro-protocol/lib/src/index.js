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
var NitroAdjudicator_json_1 = __importDefault(require("../build/contracts/NitroAdjudicator.json"));
var TrivialApp_json_1 = __importDefault(require("../build/contracts/TrivialApp.json"));
var Token_json_1 = __importDefault(require("../build/contracts/Token.json"));
var AssetHolder_json_1 = __importDefault(require("../build/contracts/AssetHolder.json"));
var ERC20AssetHolder_json_1 = __importDefault(require("../build/contracts/ERC20AssetHolder.json"));
var ETHAssetHolder_json_1 = __importDefault(require("../build/contracts/ETHAssetHolder.json"));
exports.ContractArtifacts = {
    NitroAdjudicatorArtifact: NitroAdjudicator_json_1.default,
    TrivialAppArtifact: TrivialApp_json_1.default,
    Erc20AssetHolderArtifact: ERC20AssetHolder_json_1.default,
    EthAssetHolderArtifact: ETHAssetHolder_json_1.default,
    TokenArtifact: Token_json_1.default,
    AssetHolderArtifact: AssetHolder_json_1.default,
};
var test_helpers_1 = require("../test/test-helpers");
exports.getTestProvider = test_helpers_1.getTestProvider;
exports.randomChannelId = test_helpers_1.randomChannelId;
exports.randomExternalDestination = test_helpers_1.randomExternalDestination;
exports.replaceAddressesAndBigNumberify = test_helpers_1.replaceAddressesAndBigNumberify;
exports.setupContracts = test_helpers_1.setupContracts;
var asset_holder_1 = require("./contract/asset-holder");
exports.getAssetTransferredEvent = asset_holder_1.getAssetTransferredEvent;
exports.getDepositedEvent = asset_holder_1.getDepositedEvent;
exports.convertBytes32ToAddress = asset_holder_1.convertBytes32ToAddress;
exports.convertAddressToBytes32 = asset_holder_1.convertAddressToBytes32;
var challenge_1 = require("./contract/challenge");
exports.getChallengeRegisteredEvent = challenge_1.getChallengeRegisteredEvent;
exports.getChallengeClearedEvent = challenge_1.getChallengeClearedEvent;
var channel_1 = require("./contract/channel");
exports.getChannelId = channel_1.getChannelId;
var force_move_app_1 = require("./contract/force-move-app");
exports.validTransition = force_move_app_1.validTransition;
exports.ForceMoveAppContractInterface = force_move_app_1.ForceMoveAppContractInterface;
exports.createValidTransitionTransaction = force_move_app_1.createValidTransitionTransaction;
var outcome_1 = require("./contract/outcome");
exports.encodeAllocation = outcome_1.encodeAllocation;
exports.encodeOutcome = outcome_1.encodeOutcome;
exports.decodeOutcome = outcome_1.decodeOutcome;
exports.isAllocationOutcome = outcome_1.isAllocationOutcome;
exports.isGuaranteeOutcome = outcome_1.isGuaranteeOutcome;
exports.encodeGuarantee = outcome_1.encodeGuarantee;
exports.hashOutcome = outcome_1.hashOutcome;
var channel_storage_1 = require("./contract/channel-storage");
exports.channelDataToChannelStorageHash = channel_storage_1.channelDataToChannelStorageHash;
var state_1 = require("./contract/state");
exports.getVariablePart = state_1.getVariablePart;
exports.getFixedPart = state_1.getFixedPart;
exports.hashAppPart = state_1.hashAppPart;
exports.hashState = state_1.hashState;
var erc20_asset_holder_1 = require("./contract/transaction-creators/erc20-asset-holder");
exports.createERC20DepositTransaction = erc20_asset_holder_1.createDepositTransaction;
var eth_asset_holder_1 = require("./contract/transaction-creators/eth-asset-holder");
exports.createETHDepositTransaction = eth_asset_holder_1.createDepositTransaction;
exports.createTransferAllTransaction = eth_asset_holder_1.createTransferAllTransaction;
var signatures_1 = require("./signatures");
exports.signState = signatures_1.signState;
exports.getStateSignerAddress = signatures_1.getStateSignerAddress;
exports.signChallengeMessage = signatures_1.signChallengeMessage;
exports.signStates = signatures_1.signStates;
var Signatures = __importStar(require("./signatures"));
exports.Signatures = Signatures;
var Transactions = __importStar(require("./transactions"));
exports.Transactions = Transactions;
//# sourceMappingURL=index.js.map