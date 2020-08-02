/* Ethereum wallet utilities */
import { ethers } from "ethers";
const { bigNumberify, hexlify } = ethers.utils;
const { HashZero } = ethers.constants;

/* Statechannel wallet utilities */
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
} from "@statechannels/nitro-protocol"

// Contracts contains all embark smart contract instances
// Web3 contains...web3 (and associated accounts, etc)
// Logger is Embark's custom logger
modules.exports = async ({ contracts, web3, logger}) => {

	/** This first script sets up the basic payment channel
	 * The two accounts that will be sending transactions: account 1 and account 2
   * See the nitro-tutorial repo for where I got the basics on how to do this **/

	// Setup channel parameters
	const participants = [web3.eth.accounts[0], web3.eth.accounts[1]]
	const chainId = "0x1234" //TODO get from the actual deployed web3?
	const channelNonce = 0;

	// Create channel object, and calculate channelId using helper function
	const channel: Channel = { chainId, channelNonce, participants };
	const channelId = getChannelID(channel)

	// Now that we have our channel setup, we can go ahead and deposit assets into it
	// (as long as we have a deployed compatible assetholder contract!)
};
