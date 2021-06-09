// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.1;
pragma experimental ABIEncoderV2;

import "../TransferDefinition.sol";

/// @title Hashlock Transfer
/// @notice This contract allows users to claim a payment locked in
///         the application if they provide the correct preImage. The payment is
///         reverted if not unlocked by the timelock if one is provided.

contract MessageTransfer is TransferDefinition {
    struct TransferState {
        string message;
    }

    struct TransferResolver {
        string message;
    }

    string public constant override Name = "MessageTransfer";
    string
        public constant
        override StateEncoding = "tuple(string message)";
    string
        public constant
        override ResolverEncoding = "tuple(string message)";

    // @notice returns the encoded cancellation resolver
    function EncodedCancel() external pure override returns(bytes memory) {
        TransferResolver memory resolver = TransferResolver('');
        return abi.encode(resolver);
    }

    /* solhint-disable */
    function create(bytes calldata /*encodedBalance*/, bytes calldata /*encodedState*/)
        external
        override
        pure
        returns (bool)
    {
        return true;
    }

    function resolve(
        bytes calldata encodedBalance,
        bytes calldata /*encodedState*/,
        bytes calldata /*encodedResolver*/
    ) external override pure returns (Balance memory) {
        Balance memory balance = abi.decode(encodedBalance, (Balance));
        return balance;
    }
    /* solhint-enable */
}
