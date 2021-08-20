// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/compatibility/GovernorCompatibilityBravo.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract HypernetGovernor is Governor, GovernorCompatibilityBravo, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl {
    constructor(ERC20Votes _token, TimelockController _timelock)
        Governor("HypernetGovernor")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
        GovernorTimelockControl(_timelock)
    {}

    // mapping for retrieving gateways
    mapping (string => string) private gateways;

    // mapping for retrieving liquidity providers
    mapping (string => string) private liquidityProviders;

    function votingDelay() public pure override returns (uint256) {
        return 1; // blocks (1 block is about 13 seconds)
    }

    function votingPeriod() public pure override returns (uint256) {
        return 100; // blocks
    }

    function proposalThreshold() public pure override returns (uint256) {
        // number of votes required to in order to submit a successful proposal
        return 1_000_000e18; // 1 percent of all Hypertoken
    }

    // lookup gateway signature and payload hash via the gateway URL
    function getGateway(string memory _gatewayurl) 
        public 
        view 
        returns (string memory) 
    {
      return gateways[_gatewayurl];
    }

    // lookup liquidity provider supported tokens via LPs public identifier
    function getLP(string memory _publicidentifier) 
        public 
        view 
        returns (string memory) 
    {
      return liquidityProviders[_publicidentifier];
    }

    function setGateway(string memory _gatewayurl, string memory _text) 
        public 
        onlyGovernance()
    {
      gateways[_gatewayurl] = _text;
    }

    function setLP(string memory _publicidentifier, string memory _text) 
        public 
        onlyGovernance()
    {
      liquidityProviders[_publicidentifier] = _text;
    }

    // The functions below are overrides required by Solidity.

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function getVotes(address account, uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotes)
        returns (uint256)
    {
        return super.getVotes(account, blockNumber);
    }

    function state(uint256 proposalId)
        public
        view
        override(Governor, IGovernor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public
        override(Governor, GovernorCompatibilityBravo, IGovernor)
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }

    function _execute(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
    {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor, IERC165, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}