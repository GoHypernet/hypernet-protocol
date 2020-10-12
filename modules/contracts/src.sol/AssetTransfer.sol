// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.1;
pragma experimental ABIEncoderV2;

import "./interfaces/IERC20.sol";
import "./lib/LibAsset.sol";
import "./lib/LibUtils.sol";
import "./lib/SafeMath.sol";


contract AssetTransfer {

    using SafeMath for uint256;

    // TODO: These are ad hoc values. Confirm or find more suitable ones.
    uint256 private constant ETHER_TRANSFER_GAS_LIMIT = 10000;
    uint256 private constant ERC20_TRANSFER_GAS_LIMIT = 100000;
    uint256 private constant ERC20_BALANCE_GAS_LIMIT = 5000;

    mapping(address => uint256) private _totalTransferred;
    mapping(address => mapping(address => uint256)) private _emergencyWithdrawableAmount;

    modifier onlySelf() {
        require(
            msg.sender == address(this),
            "AssetTransfer: Can only be called from this contract"
        );
        _;
    }

    function safelyTransferEther(address payable recipient, uint256 maxAmount)
        private
        returns (bool, uint256)
    {
        uint256 balance = address(this).balance;
        uint256 amount = LibUtils.min(maxAmount, balance);
        (bool success, ) = recipient.call{gas: ETHER_TRANSFER_GAS_LIMIT, value: amount}("");
        return (success, success ? amount : 0);
    }

    function safelyTransferERC20(address assetId, address recipient, uint256 maxAmount)
        private
        returns (bool, uint256)
    {
        (bool success, bytes memory encodedReturnValue) = address(this).call{gas: ERC20_BALANCE_GAS_LIMIT}(
            abi.encodeWithSignature("_getOwnERC20Balance(address)", assetId)
        );
        if (!success) { return (false, 0); }

        uint256 balance = abi.decode(encodedReturnValue, (uint256));
        uint256 amount = LibUtils.min(maxAmount, balance);
        (success, ) = address(this).call{gas: ERC20_TRANSFER_GAS_LIMIT}(
            abi.encodeWithSignature("_transferERC20(address,address,uint256)", assetId, recipient, amount)
        );
        return (success, success ? amount : 0);
    }

    function safelyTransfer(address assetId, address payable recipient, uint256 maxAmount)
        private
        returns (bool, uint256)
    {
        return LibAsset.isEther(assetId) ?
            safelyTransferEther(recipient, maxAmount) :
            safelyTransferERC20(assetId, recipient, maxAmount);

    }

    function _getOwnERC20Balance(address assetId)
        external
        onlySelf
        view
        returns (uint256)
    {
        return IERC20(assetId).balanceOf(address(this));
    }

    function _transferERC20(address assetId, address recipient, uint256 amount)
        external
        onlySelf
        returns (bool)
    {
        return LibAsset.transferERC20(assetId, recipient, amount);
    }

    function registerTransfer(address assetId, uint256 amount)
        internal
    {
        _totalTransferred[assetId] += amount;
    }

    function addToEmergencyWithdrawableAmount(address assetId, address owner, uint256 amount)
        internal
    {
        _emergencyWithdrawableAmount[assetId][owner] += amount;
    }

    function transferAsset(address assetId, address payable recipient, uint256 maxAmount)
        internal
        returns (bool)
    {
        (bool success, uint256 amount) = safelyTransfer(assetId, recipient, maxAmount);

        if (success) {
            registerTransfer(assetId, amount);
        } else {
            addToEmergencyWithdrawableAmount(assetId, recipient, maxAmount);
        }

        return success;
    }

    function totalTransferred(address assetId)
        public
        view
        returns (uint256)
    {
        return _totalTransferred[assetId];
    }

    function emergencyWithdrawableAmount(address assetId, address owner)
        public
        view
        returns (uint256)
    {
        return _emergencyWithdrawableAmount[assetId][owner];
    }

    function emergencyWithdraw(address assetId, address owner, address payable recipient)
        external
    {
        require(
            msg.sender == owner || owner == recipient,
            "AssetTransfer: Either msg.sender or recipient of funds must be the owner of an emergency withdraw"
        );

        uint256 maxAmount = _emergencyWithdrawableAmount[assetId][owner];
        uint256 balance = LibAsset.getOwnBalance(assetId);
        uint256 amount = LibUtils.min(maxAmount, balance);

        _emergencyWithdrawableAmount[assetId][owner] = _emergencyWithdrawableAmount[assetId][owner].sub(amount);
        registerTransfer(assetId, maxAmount);
        require(
            LibAsset.transfer(assetId, recipient, amount),
            "AssetTransfer: Transfer failed"
        );
    }

}
