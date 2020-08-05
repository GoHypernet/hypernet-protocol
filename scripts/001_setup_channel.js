/* Ethereum wallet utilities */

//import { ethers } from "ethers";
const ethers = require("ethers");
//console.log(ethers)
//const { bigNumberify, hexlify } = ethers.utils;
//const { HashZero } = ethers.constants;


/* Statechannel wallet utilities */
/*
import {
	Channel,
	getChannelId,
	State,
	getVariablePart,
	getFixedPart,
	signStates,
	SignedState,
	signState,
	signChallengeMessage,
} from "@statechannels/nitro-protocol";
*/
const nitro = require("@statechannels/nitro-protocol");
//console.log(nitro);

// Contracts contains all embark smart contract instances
// Web3 contains...web3 (and associated accounts, etc)
// Logger is Embark's custom logger
module.exports = async ({ contracts, web3, logger}) => {

	const accounts = await web3.eth.getAccounts();
	const account1 = accounts[0];
	const account2 = accounts[1];

	/** This first script sets up the basic payment channel
	 * The two accounts that will be sending transactions: account 1 and account 2
   * See the nitro-tutorial repo for where I got the basics on how to do this **/

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
};
