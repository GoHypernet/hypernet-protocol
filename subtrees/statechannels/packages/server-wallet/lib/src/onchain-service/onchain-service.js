"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nitro_protocol_1 = require("@statechannels/nitro-protocol");
const ethers_1 = require("ethers");
const evt_1 = require("evt");
const wallet_core_1 = require("@statechannels/wallet-core");
const logger_1 = require("../logger");
const utils_1 = require("./utils");
const getAssetHolderContract = (info) => {
    return new ethers_1.Contract(info.assetHolderAddress, info.tokenAddress === ethers_1.constants.AddressZero
        ? nitro_protocol_1.ContractArtifacts.EthAssetHolderArtifact.abi
        : nitro_protocol_1.ContractArtifacts.Erc20AssetHolderArtifact.abi);
};
const getAssetHolderInformation = async (assetHolderAddress, provider) => {
    const assetHolder = new ethers_1.Contract(assetHolderAddress, nitro_protocol_1.ContractArtifacts.Erc20AssetHolderArtifact.abi, provider);
    let tokenAddress;
    try {
        tokenAddress = await assetHolder.Token();
    }
    catch (e) {
        tokenAddress = ethers_1.constants.AddressZero;
    }
    return { tokenAddress, assetHolderAddress };
};
class OnchainService {
    constructor(provider, storage) {
        this.assetHolders = new Map();
        this.channelWallet = undefined;
        this.provider =
            typeof provider === 'string' ? new ethers_1.providers.JsonRpcProvider(provider) : provider;
        this.storage = storage;
        logger_1.logger.info('OnchainService created');
    }
    attachChannelWallet(wallet) {
        this.channelWallet = wallet;
        logger_1.logger.info('Attached ChannelWallet');
    }
    attachHandler(assetHolderAddr, event, callback, filter, timeout) {
        const record = this.assetHolders.get(assetHolderAddr);
        if (!record) {
            throw new Error(`Could not find asset holder with service`);
        }
        const evt = record.evts[event];
        if (!evt) {
            throw new Error(`${event} not handled`);
        }
        return utils_1.addEvtHandler(evt, callback, filter, timeout);
    }
    detachAllHandlers(assetHolderAddr, event) {
        const record = this.assetHolders.get(assetHolderAddr);
        if (!record) {
            throw new Error(`Could not find asset holder with service`);
        }
        if (event) {
            record.evts[event].detach();
            logger_1.logger.info(`Detached ${event} handlers`, {
                assetHolderAddress: record.assetHolderAddress,
                tokenAddress: record.tokenAddress,
            });
            return;
        }
        Object.values(record.evts).map(evt => {
            evt.detach();
        });
        logger_1.logger.info(`Detached all handlers`, {
            assetHolderAddress: record.assetHolderAddress,
            tokenAddress: record.tokenAddress,
        });
    }
    async registerChannel(channelId, assetHolders) {
        await this.storage.registerChannel(channelId);
        await Promise.all(assetHolders.map(async (assetHolderAddr) => {
            if (this.assetHolders.has(assetHolderAddr)) {
                return;
            }
            const info = await getAssetHolderInformation(assetHolderAddr, this.provider);
            this._registerAssetHolderCallbacks(info);
        }));
        logger_1.logger.info(`Registered channel`, {
            channelId,
            assetHolders,
        });
    }
    _createFundingEvt() {
        const depositEvt = evt_1.Evt.create();
        depositEvt
            .pipe(e => {
            return this.storage.hasChannel(e.channelId);
        })
            .pipe(e => {
            var _a;
            const record = this.storage.getLatestEvent(e.channelId, 'Funding');
            const prevHoldings = ethers_1.BigNumber.from(((_a = record) === null || _a === void 0 ? void 0 : _a.amount) || 0);
            return prevHoldings.lt(e.amount);
        })
            .attach(e => {
            this.storage.saveEvent(e.channelId, e);
        });
        logger_1.logger.debug(`Created deposit evt`);
        return depositEvt;
    }
    _registerAssetHolderCallbacks(info) {
        const fundingEvt = this._createFundingEvt();
        fundingEvt.attach(e => {
            this.channelWallet &&
                this.channelWallet.updateChannelFunding({
                    channelId: e.channelId,
                    amount: wallet_core_1.BN.from(e.amount),
                    token: info.tokenAddress,
                });
        });
        const contract = getAssetHolderContract(info).connect(this.provider);
        contract.on('Deposited', (destination, amountDeposited, destinationHoldings, event) => {
            fundingEvt.post({
                channelId: destination,
                transactionHash: event.transactionHash,
                amount: amountDeposited.toString(),
                blockNumber: event.blockNumber,
                final: false,
                type: 'Deposited',
                destinationHoldings: destinationHoldings.toString(),
            });
        });
        const evts = { Funding: fundingEvt };
        this.assetHolders.set(info.assetHolderAddress, { ...info, evts });
        logger_1.logger.debug(`Registered AssetHolder callbacks`, info);
    }
}
exports.OnchainService = OnchainService;
//# sourceMappingURL=onchain-service.js.map