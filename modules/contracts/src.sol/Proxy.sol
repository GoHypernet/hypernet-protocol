// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.1;


/// @title Proxy - Generic proxy contract allows to execute all transactions applying the code of a master contract.
/// @author Stefan George - <stefan@gnosis.io>
/// @author Richard Meissner - <richard@gnosis.io>
contract Proxy {

    // mastercopy always needs to be first declared variable
    // This ensures that it is at the same location in the contracts to which calls are delegated.
    // To reduce deployment costs this variable is internal and needs to be retrieved via `getStorageAt`
    address internal mastercopy;

    /// @dev Constructor function sets address of master copy contract.
    /// @param _mastercopy Master copy address.
    constructor(address _mastercopy)
    {
        require(_mastercopy != address(0), "Invalid master copy address provided");
        mastercopy = _mastercopy;
    }

    /// @dev Fallback function forwards all transactions and returns all received return data.
    fallback()
        external
        payable
    {
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            let _mastercopy := and(sload(0), 0xffffffffffffffffffffffffffffffffffffffff)
            calldatacopy(0, 0, calldatasize())
            let success := delegatecall(gas(), _mastercopy, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            if eq(success, 0) { revert(0, returndatasize()) }
            return(0, returndatasize())
        }
    }
}
