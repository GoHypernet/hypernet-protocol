/**
 * 001_setup_channel
 *
 * sets up a payment channel, and has each participant deposit 100 hypertokens into it
 **/

const ethers = require("ethers");
const nitro = require("@statechannels/nitro-protocol");

// Contracts contains all embark smart contract instances
// Web3 contains...web3 (and associated accounts, etc)
// Logger is Embark's custom logger
module.exports = async ({ contracts, web3, logger}) => {

	// Accounts
	const accounts = await web3.eth.getAccounts();
	const account1 = accounts[0];
	const account2 = accounts[1];

	// Setup channel parameters
	const participants = [account1, account2];
	const chainId = "0x1234"; //TODO get from the actual deployed web3?
	const channelNonce = 0;

	// Create channel object, and calculate channelId using helper function
	const channel = { chainId, channelNonce, participants };
	const channelId = nitro.getChannelId(channel);

	console.log(`payment channel id: ${channelId}`);

	// Now that we have our channel setup, we can go ahead and deposit assets into it
	// (as long as we have a deployed compatible assetholder contract!)
	const amountToDeposit = web3.utils.toWei('100');

	const getTokens1 = await contracts.Hypertoken.methods.getXFreeTokens(amountToDeposit).send({from: account1});
	const getTokens2 = await contracts.Hypertoken.methods.getXFreeTokens(amountToDeposit).send({from: account2});

	const approveTx1 = await contracts.Hypertoken.methods.increaseAllowance(contracts.HypertokenAssetHolder.address, amountToDeposit).send({from: account1});
	console.log(`${account1}: approved 100 Hypertokens to HypertokenAssetHolder`);
	const approveTx2 = await contracts.Hypertoken.methods.increaseAllowance(contracts.HypertokenAssetHolder.address, amountToDeposit).send({from: account2});
	console.log(`${account2}: approved 100 Hypertokens to HypertokenAssetHolder`);

	const deposit1Tx = await contracts.HypertokenAssetHolder.methods.deposit(channelId, 0, amountToDeposit).send({from: account1});
	console.log(`${account1}: deposited 100 Hypertokens to HypertokenAssetHolder`);
	const deposit2Tx = await contracts.HypertokenAssetHolder.methods.deposit(channelId, amountToDeposit, amountToDeposit).send({from: account2});
	console.log(`${account2}: deposited 100 Hypertokens to HypertokenAssetHolder`);
}
