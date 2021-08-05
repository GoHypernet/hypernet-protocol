// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Hypertoken is ERC20 {
    constructor() ERC20("Hypertoken", "HYPR") {
        _mint(msg.sender, 100000000 ether);
    }

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}
