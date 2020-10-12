// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.1;
pragma experimental "ABIEncoderV2";

import "./Types.sol";

interface ITransferDefinition {
  // Validates the initial state of the transfer.
  // Called by validator.ts during `create` updates.
  function create(bytes calldata encodedBalance, bytes calldata) external view returns (bool);

  // Performs a state transition to resolve a transfer and returns final balances.
  // Called by validator.ts during `resolve` updates.
  function resolve(
    bytes calldata encodedBalance,
    bytes calldata,
    bytes calldata
  ) external view returns (Balance memory);

  // Should also have the following properties
  // string name
  // string stateEncoding
  // string resolverEncoding
  // These properties are included on the transfer specifically
  // to make it easier for implementers to add new transfers by
  // only include a `.sol` file
  function getRegistryInformation() external view returns (RegisteredTransfer memory);
}
