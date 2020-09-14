pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import './AssetHolder.sol';

/**
  * @dev Ther ETHAssetHolder contract extends the AssetHolder contract, and adds the following functionality: it allows ETH to be escrowed against a state channelId and to be transferred to external destinations.
*/
contract ETHAssetHolder is AssetHolder {
    /**
    * @notice Constructor function storing the AdjudicatorAddress.
    * @dev Constructor function storing the AdjudicatorAddress.
    * @param _AdjudicatorAddress Address of an Adjudicator  contract, supplied at deploy-time.
    */
    constructor(address _AdjudicatorAddress) public {
        AdjudicatorAddress = _AdjudicatorAddress;
    }

    /**
    * @notice Deposit ETH against a given destination.
    * @dev Deposit ETH against a given destination.
    * @param destination ChannelId to be credited.
    * @param expectedHeld The number of wei the depositor believes are _already_ escrowed against the channelId.
    * @param amount The intended number of wei to be deposited.
    */
    function deposit(bytes32 destination, uint256 expectedHeld, uint256 amount) public payable {
        require(!_isExternalDestination(destination), 'Cannot deposit to external destination');
        require(msg.value == amount, 'Insufficient ETH for ETH deposit');
        uint256 amountDeposited;
        // this allows participants to reduce the wait between deposits, while protecting them from losing funds by depositing too early. Specifically it protects against the scenario:
        // 1. Participant A deposits
        // 2. Participant B sees A's deposit, which means it is now safe for them to deposit
        // 3. Participant B submits their deposit
        // 4. The chain re-orgs, leaving B's deposit in the chain but not A's
        require(
            holdings[destination] >= expectedHeld,
            'Deposit | holdings[destination] is less than expected'
        );
        require(
            holdings[destination] < expectedHeld.add(amount),
            'Deposit | holdings[destination] already meets or exceeds expectedHeld + amount'
        );

        // The depositor wishes to increase the holdings against channelId to amount + expectedHeld
        // The depositor need only deposit (at most) amount + (expectedHeld - holdings) (the term in parentheses is non-positive)

        amountDeposited = expectedHeld.add(amount).sub(holdings[destination]); // strictly positive
        // require successful deposit before updating holdings (protect against reentrancy)
        // refund whatever wasn't deposited.
        msg.sender.transfer(amount.sub(amountDeposited));
        holdings[destination] = holdings[destination].add(amountDeposited);
        emit Deposited(destination, amountDeposited, holdings[destination]);
    }

    /**
    * @notice Transfers the given number of wei to a supplied ethereum address.
    * @dev Transfers the given number of wei to a supplied ethereum address.
    * @param destination Ethereum address to be credited.
    * @param amount Quantity of wei to be transferred.
    */
    function _transferAsset(address payable destination, uint256 amount) internal override {
        destination.transfer(amount);
    }

}
