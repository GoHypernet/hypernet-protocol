// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.1;
pragma experimental ABIEncoderV2;

import "./interfaces/ICMCAdjudicator.sol";
import "./interfaces/ITransferDefinition.sol";
import "./CMCCore.sol";
import "./CMCAccountant.sol";
import "./lib/LibChannelCrypto.sol";
import "./lib/MerkleProof.sol";
import "./lib/SafeMath.sol";

/// @title Adjudicator - Dispute logic for ONE channel
contract CMCAdjudicator is CMCCore, CMCAccountant, ICMCAdjudicator {
  using LibChannelCrypto for bytes32;
  using SafeMath for uint256;

  ChannelDispute private channelDispute;
  TransferDispute private transferDispute;

  function getLatestChannelDispute() public override view returns (ChannelDispute memory) {
    return channelDispute;
  }

  function getLatestTransferDispute() public override view returns (TransferDispute memory) {
    return transferDispute;
  }

  // PSEUDOCODE: Please don't delete yet!
  // ChannelDispute memory lastDispute = channelDisputes(channelAddress)
  // validateSignatures(signatures, participants, state);
  // require(!inDefundPhase(lastDispute))
  // require(state.nonce >= lastDispute.nonce)
  // if (state.nonce == lastDispute.nonce) {
  //     require(!inConsensusPhase(lastDispute))
  //     channelDispute(channelAddress).consensusExpiry = block.number.add(state.timeout)
  //     channelDispute(channelAddress).defundExpiry = block.number.add(state.timeout.mul(2))
  // } else { -- state.nonce > lastDispute.nonce
  //     ChannelDispute channelDispute = {
  //         channelStateHash: hash(state),
  //         nonce: state.nonce,
  //         merkleRoot: state.merkleRoot,
  //         consensusExpiry: block.number.add(state.timeout)
  //         defundExpiry: block.number.add(state.timeout.mul(2))
  //         assetDefunded: empty mapping
  //      };
  // }
  function disputeChannel(CoreChannelState memory ccs, bytes[2] memory signatures) public override {
    verifySignatures(ccs.alice, ccs.bob, ccs, signatures);
    require(!inDefundPhase(), "Adjudicator disputeChannel: Not allowed in defund phase");
    require(channelDispute.nonce <= ccs.nonce, "Adjudicator disputeChannel: New nonce smaller than stored one");
    if (inConsensusPhase()) {
      require(
        channelDispute.nonce < ccs.nonce,
        "Adjudicator disputeChannel: Same nonce not allowed in consensus phase"
      );
      channelDispute.channelStateHash = hashChannelState(ccs);
      channelDispute.nonce = ccs.nonce;
      channelDispute.merkleRoot = ccs.merkleRoot;
    } else {
      // during regular operation
      // Only participants may start a dispute
      verifySenderIsParticipant(ccs);
      // For equality, skip updates without effect and only set new expiries
      if (channelDispute.nonce < ccs.nonce) {
        channelDispute.channelStateHash = hashChannelState(ccs);
        channelDispute.nonce = ccs.nonce;
        channelDispute.merkleRoot = ccs.merkleRoot;
      }
      // TODO: offchain-ensure that there can't be an overflow
      channelDispute.consensusExpiry = block.number.add(ccs.timeout);
      channelDispute.defundExpiry = block.number.add(ccs.timeout.mul(2));
    }
  }

  // PSEUDOCODE: Please don't delete yet!
  // require(inDefundPhase(channelDispute))
  // require(hash(state) == channelDispute.channelStateHash)
  // for(int i = 0, i < assetIds.length(), i++) {
  //      require(!channelDispute.assetDefunded[assetIds[i]])
  //      channelDispute.assetDefunded[assetIds[i]] = true
  //      ChannelMastercopy channel = ChannelMastercopy(channelAddress)
  //
  //      Balance memory aBalance, bBalance; //Bad syntax here, I know
  //      aBalance.to = state.balA.to
  //      bBalance.to = state.balB.to
  //
  //      channel.transfer([aBalance, bBalance], assetIds[i]);
  //  }
  function defundChannel(CoreChannelState memory ccs) public override {
    verifySenderIsParticipant(ccs);
    require(inDefundPhase(), "Adjudicator defundChannel: Not in defund phase");
    require(!channelDispute.isDefunded, "Adjudicator defundChannel: channel already defunded");
    channelDispute.isDefunded = true;
    require(
      hashChannelState(ccs) == channelDispute.channelStateHash,
      "Adjudicator defundChannel: Hash of core channel state does not match stored hash"
    );
    // TODO SECURITY: Beware of reentrancy
    // TODO: keep this? offchain code has to ensure this
    // TODO: compare against saved deposit values?
    // for (uint256 i = 0; i < ccs.balances.length; i++) {
    //     Balance memory balance = ccs.balances[i];
    //     address assetId = ccs.assetIds[i];
    //     Balance memory transfer;
    //     transfer.to[0] = balance.to[0];
    //     transfer.to[1] = balance.to[1];
    //     transfer.amount[0] = balance.amount[0];
    //     transferBalance(assetId, transfer);
    // }
  }

  // PSEUDOCODE: Please don't delete yet!
  // require(inDefundPhase(channelDispute))
  // require(doMerkleProof(hash(state), channelDispute.merkleRoot, state.merkleProofData))
  // require(!inTransferDispute(transferDispute) && !afterTransferDispute(transferDispute))
  // require(!transferDispute.isDefunded)
  // TransferDispute transferDispute = {
  //      transferDisputeExpiry: block.number.add(state.timeout)
  //      transferStateHash: hash(state)
  //      isDefunded: false
  // }
  function disputeTransfer(CoreTransferState memory cts, bytes32[] memory merkleProofData)
    public
    override
  // TODO: Who should be able to call this?
  {
    require(inDefundPhase(), "Adjudicator disputeTransfer: Not in defund phase");
    bytes32 transferStateHash = hashTransferState(cts);
    verifyMerkleProof(transferStateHash, channelDispute.merkleRoot, merkleProofData);
    require(transferDispute.transferDisputeExpiry == 0, "Adjudicator disputeTransfer: transfer already disputed");
    // necessary?
    require(!transferDispute.isDefunded, "Adjudicator disputeTransfer: transfer already defunded");
    // TODO: offchain-ensure that there can't be an overflow
    transferDispute.transferStateHash = transferStateHash;
    transferDispute.transferDisputeExpiry = block.number.add(cts.transferTimeout);
  }

  // PSEUDOCODE: Please don't delete yet!
  // require(hash(state) == transferDispute.transferStateHash)
  // require(inTransferDispute(transferDispute) || afterTransferDispute(transferDispute))
  // uint256[] finalBalances;
  // if(afterTransferDispute(transferDispute)) { -- empty it with created state
  //      finalBalances = state.balances
  // } else // inTransferDispute(transferDispute) {
  //      TransferState memory initialTransferState = abi.decode(encodedInitialTransferState, state.encodings[0])
  //
  //      require(hash(initialTransferState) == state.initialStateHash)
  //      TransferInterface transferInterface = TransferInterface(state.transferDefinition)
  //
  //      encodedResolvedBalances = transferInterface.resolve(encodedInitialTransferState,encodedTransferResolver)
  //      finalBalances = abi.decode(encodedResolvedBalances, Balances)
  // }
  //
  // transferDispute.isDefunded = true;
  // ChannelMastercopy channel = ChannelMastercopy(channelAddress)
  // channel.transfer(finalBalances, state.assetId)
  function defundTransfer(
    CoreTransferState memory cts,
    bytes memory encodedInitialTransferState,
    bytes memory encodedTransferResolver // TODO: Who should be able to call this?
  ) public override {
    require(
      hashTransferState(cts) == transferDispute.transferStateHash,
      "Adjudicator defundTransfer: Hash of core transfer state does not match stored hash"
    );
    // TODO: check / simplify
    require(transferDispute.transferDisputeExpiry != 0, "Adjudicator defundTransfer: transfer not yet disputed");
    require(!transferDispute.isDefunded, "Adjudicator defundTransfer: transfer already defunded");
    Balance memory finalBalance;
    if (block.number < transferDispute.transferDisputeExpiry) {
      require(
        keccak256(encodedInitialTransferState) == cts.initialStateHash,
        "Adjudicator defundTransfer: Hash of encoded initial transfer state does not match stored hash"
      );
      ITransferDefinition transferDefinition = ITransferDefinition(cts.transferDefinition);
      finalBalance = transferDefinition.resolve(
        abi.encode(cts.balance),
        encodedInitialTransferState,
        encodedTransferResolver
      );
    } else {
      finalBalance = cts.balance;
    }
    transferBalance(cts.assetId, finalBalance);
  }

  function verifySenderIsParticipant(CoreChannelState memory ccs) internal view {
    require(msg.sender == ccs.alice || msg.sender == ccs.bob, "Adjudicator: msg.sender is not channel participant");
  }

  function verifySignatures(
    address alice,
    address bob,
    CoreChannelState memory ccs,
    bytes[2] memory signatures
  ) internal pure {
    verifySignature(alice, ccs, signatures[0]);
    verifySignature(bob, ccs, signatures[1]);
  }

  function verifySignature(
    address participant,
    CoreChannelState memory ccs,
    bytes memory signature
  ) internal pure {
    // TODO WIP, check this!!
    bytes32 generatedHash = hashChannelState(ccs);
    require(
      participant == generatedHash.verifyChannelMessage(signature),
      "Adjudicator: invalid signature on core channel state"
    );
    return;
  }

  function verifyMerkleProof(
    bytes32 leaf,
    bytes32 root,
    bytes32[] memory proof
  ) internal pure {
    require(MerkleProof.verify(proof, root, leaf), "Adjudicator: Merkle proof verification failed");
  }

  function inConsensusPhase() internal view returns (bool) {
    return block.number < channelDispute.consensusExpiry;
  }

  function inDefundPhase() internal view returns (bool) {
    return channelDispute.consensusExpiry <= block.number && block.number < channelDispute.defundExpiry;
  }

  function hashChannelState(CoreChannelState memory ccs) internal pure returns (bytes32) {
    return keccak256(abi.encode(ccs));
  }

  function hashTransferState(CoreTransferState memory cts) internal pure returns (bytes32) {
    return keccak256(abi.encode(cts));
  }
}
