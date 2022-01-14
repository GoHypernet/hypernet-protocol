// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Vester {
    using SafeMath for uint;

    address public h;
    address public recipient;

    uint public vestingAmount;
    uint public vestingBegin;
    uint public vestingCliff;
    uint public vestingEnd;

    uint public lastUpdate;

    constructor(
        address h_,
        address recipient_,
        uint vestingAmount_,
        uint vestingBegin_,
        uint vestingCliff_,
        uint vestingEnd_
    ) {
        require(vestingBegin_ >= block.timestamp, 'Vester::constructor: vesting begin too early');
        require(vestingCliff_ >= vestingBegin_, 'Vester::constructor: cliff is too early');
        require(vestingEnd_ > vestingCliff_, 'Vester::constructor: end is too early');

        h = h_;
        recipient = recipient_;

        vestingAmount = vestingAmount_;
        vestingBegin = vestingBegin_;
        vestingCliff = vestingCliff_;
        vestingEnd = vestingEnd_;

        lastUpdate = vestingBegin;
    }

    function timeNow() public view returns (uint timenow) {
        timenow = block.timestamp;
    }

    function setRecipient(address recipient_) public {
        require(msg.sender == recipient, 'TreasuryVester::setRecipient: unauthorized');
        recipient = recipient_;
    }

    function delegate(address recipient_) public {
        require(msg.sender == recipient, 'TreasuryVester::setRecipient: unauthorized');
        IHypertoken(h).delegate(recipient_);        
    }

    function claim() public {
        require(block.timestamp >= vestingCliff, 'Vester::claim: not time yet');
        uint amount;
        if (block.timestamp >= vestingEnd) {
            amount = IHypertoken(h).balanceOf(address(this));
        } else {
            amount = vestingAmount.mul(block.timestamp - lastUpdate).div(vestingEnd - vestingBegin);
            lastUpdate = block.timestamp;
        }
        require(IHypertoken(h).transfer(recipient, amount), "Vester::claim: token transfer failed");
    }
}

interface IHypertoken {
    function balanceOf(address account) external view returns (uint);
    function transfer(address dst, uint rawAmount) external returns (bool);
    function delegate(address delegatee) external virtual; 
}