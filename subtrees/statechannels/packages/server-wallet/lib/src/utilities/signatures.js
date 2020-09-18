"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const libauth_1 = require("@bitauth/libauth");
const ethers_1 = require("ethers");
const wallet_core_1 = require("@statechannels/wallet-core");
let secp256k1;
exports.initialized = libauth_1.instantiateSecp256k1().then(m => (secp256k1 = m));
const knownWallets = {};
const cachedAddress = (privateKey) => knownWallets[privateKey] || (knownWallets[privateKey] = new ethers_1.Wallet(privateKey).address);
async function fastSignState(state, privateKey) {
    const address = cachedAddress(privateKey);
    if (state.participants.map(p => p.signingAddress).indexOf(address) < 0) {
        throw new Error("The state must be signed with a participant's private key");
    }
    const { stateHash } = state;
    const signature = await fastSignData(stateHash, privateKey);
    return { state, signature };
}
exports.fastSignState = fastSignState;
function fastRecoverAddress(state, signature, stateHash) {
    const recover = Number.parseInt('0x' + signature.slice(-2)) - 27;
    const digest = Buffer.from(hashMessage(stateHash).substr(2), 'hex');
    const recoveredAddress = ethers_1.utils.computeAddress(secp256k1.recoverPublicKeyCompressed(Buffer.from(signature.slice(2, -2), 'hex'), recover, digest));
    const { participants } = state;
    const signingAddresses = participants.map(p => p.signingAddress);
    if (signingAddresses.indexOf(recoveredAddress) < 0) {
        throw new Error(`Recovered address ${recoveredAddress} is not a participant in channel ${wallet_core_1.calculateChannelId(state)}`);
    }
    return recoveredAddress;
}
exports.fastRecoverAddress = fastRecoverAddress;
async function fastSignData(hashedData, privateKey) {
    await exports.initialized;
    const hash = hashMessage(hashedData);
    const digest = Buffer.from(hash.substr(2), 'hex');
    const signature = secp256k1.signMessageHashRecoverableCompact(Buffer.from(privateKey.substr(2), 'hex'), digest);
    const v = 27 + signature.recoveryId;
    return '0x' + Buffer.from(signature.signature).toString('hex') + v.toString(16);
}
exports.fastSignData = fastSignData;
function hashMessage(hashedData) {
    return ethers_1.utils.hashMessage(ethers_1.utils.arrayify(hashedData));
}
//# sourceMappingURL=signatures.js.map