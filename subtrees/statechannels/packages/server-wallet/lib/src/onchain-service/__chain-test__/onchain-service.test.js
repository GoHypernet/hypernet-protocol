"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nitro_protocol_1 = require("@statechannels/nitro-protocol");
const ethers_1 = require("ethers");
const transaction_submission_1 = require("../transaction-submission");
const onchain_service_1 = require("../onchain-service");
const src_1 = require("../../../src");
const store_1 = require("../store");
const config_1 = require("../../config");
jest.mock('../../../src/wallet');
describe('OnchainTransactionService', () => {
    let transactionService;
    let wallet;
    let provider;
    let onchainService;
    let channelWallet;
    let ethAssetHolder;
    const channelId = nitro_protocol_1.randomChannelId(0);
    beforeEach(async () => {
        provider = new ethers_1.providers.JsonRpcProvider(config_1.defaultConfig.rpcEndpoint);
        wallet = new ethers_1.Wallet(config_1.defaultConfig.serverPrivateKey);
        transactionService = new transaction_submission_1.TransactionSubmissionService(provider, wallet, new store_1.TransactionSubmissionStore());
        channelWallet = new src_1.Wallet(config_1.defaultConfig);
        onchainService = new onchain_service_1.OnchainService(provider, new store_1.OnchainServiceStore());
        onchainService.attachChannelWallet(channelWallet);
        ethAssetHolder = new ethers_1.Contract(config_1.defaultConfig.ethAssetHolderAddress, nitro_protocol_1.ContractArtifacts.EthAssetHolderArtifact.abi, provider);
    });
    afterEach(async () => {
        onchainService.detachAllHandlers(ethAssetHolder.address);
        await channelWallet.knex.destroy();
    });
    it('should call channel callback when event is emitted for a registered channel', async () => {
        await onchainService.registerChannel(channelId, [ethAssetHolder.address]);
        const value = ethers_1.BigNumber.from(10);
        const data = ethAssetHolder.interface.encodeFunctionData('deposit', [
            channelId,
            ethers_1.BigNumber.from(0),
            value,
        ]);
        const tx = {
            to: ethAssetHolder.address,
            data,
            value,
        };
        const p = onchainService.attachHandler(ethAssetHolder.address, 'Funding', (_e) => {
            return;
        }, (_e) => true, 15000);
        const response = await transactionService.submitTransaction(channelId, tx);
        expect(response.hash).toBeDefined();
        expect(response.data).toBe(data);
        expect(response.to).toBe(ethAssetHolder.address);
        expect(response.value.toString()).toBe(value.toString());
        const receipt = await response.wait();
        expect(receipt.transactionHash).toBe(response.hash);
        const emitted = await p;
        expect(emitted).toMatchObject({
            transactionHash: response.hash,
            type: 'Deposited',
            final: false,
            channelId,
            amount: value.toString(),
            destinationHoldings: value.toString(),
        });
        expect(channelWallet.updateChannelFunding).toHaveBeenCalled();
    });
    it('should not fail if channel is already registered', async () => {
        await onchainService.registerChannel(channelId, [ethAssetHolder.address]);
        await expect(onchainService.registerChannel(channelId, [ethAssetHolder.address])).resolves.toBeUndefined();
    });
});
//# sourceMappingURL=onchain-service.test.js.map