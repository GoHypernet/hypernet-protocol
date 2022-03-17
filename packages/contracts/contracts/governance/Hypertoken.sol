// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";


/**
 * @dev Implementation of the Hypertoken ERC-20 token.
 *
 * This implementation is based on OpenZeppelin's ERC-20 library with no additional modifications
 *
 * It was produced by the OpenZeppelin contract wizard including the `votes` and `permit` extensions:
 * https://docs.openzeppelin.com/contracts/4.x/wizard
 *
 */
contract Hypertoken is ERC20, ERC20Permit, ERC20Votes {
    constructor() ERC20("Hypertoken", "H") ERC20Permit("Hypertoken") {
        _mint(msg.sender, 100000000 * 10 ** decimals());
    }

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}