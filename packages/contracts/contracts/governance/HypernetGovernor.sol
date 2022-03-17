// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/governance/compatibility/GovernorCompatibilityBravo.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @dev Implementation of the Hypernet Protocol DAO
 *
 * This implementation is based on OpenZeppelin's Governor library with a few minor modifications
 *
 * The bulk of the logic was produced by the OpenZeppelin contract wizard including the TimelockController extension:
 * https://docs.openzeppelin.com/contracts/4.x/wizard
 * 
 * For more information on the Governor library see:
 * https://docs.openzeppelin.com/contracts/4.x/governance
 *
 * Modifications from OZ reference implementation:
 * First, the parameters _votingDelay, _votingPeriod, _proposalThreshold have setter functions that are only callable 
 * by the Timelock controller contract.
 *
 * Second, proposalIDs are stored in a mapping for easier lookups by dApps without the need for indexing services for 
 * displaying historical proposal data. This does increase the gas cost for each new proposal, however, proposals are 
 * not meant to be frequent and increasing the gas cost for a few percent is considered a non-issue for this application.
 * 
 * Third, a new internal function called _preRegistered was introduced to gate certain function calls to only users who
 * hold a Hypernet Profile Non-Fungible Identity. Specifically, this gating function is applied to the propose and 
 * execute functions. 
 */
contract HypernetGovernor is Governor, GovernorCompatibilityBravo, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl {
    constructor(ERC20Votes _token, TimelockController _timelock)
        Governor("HypernetGovernor")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
        GovernorTimelockControl(_timelock)
    {}

    using Counters for Counters.Counter;

    mapping(uint256 => uint256) public _proposalMap; // mapping from a counter to a proposalID

    Counters.Counter public _proposalIdTracker; // track number of proposals in governance

    // description for each proposal so we don't have to rely on off-chain indexing
    mapping(uint256 => string) public proposalDescriptions; 

    // be sure to set these to reasonable values for Mainnet
    uint256 private _votingDelay = 1; // blocks (1 block is about 13 seconds)

    uint256 private _votingPeriod = 20; // blocks

    uint256 private _proposalThreshold = 1_000_000e18; // number of votes required to in order to submit a successful proposal

    // address of registry that serves os the Hypernet User Profile registry
    // If this address is set to the zero address, then _preRegistered is bypassed
    address public hypernetProfileRegistry = address(0);

    function votingDelay() public view override returns (uint256) {
        return _votingDelay; 
    }

    function votingPeriod() public view override returns (uint256) {
        return _votingPeriod; 
    }

    function proposalThreshold() public view override returns (uint256) {
        return _proposalThreshold; 
    }

    function setVotingDelay(uint256 newVotingDelay) 
        public 
        onlyGovernance()
    {
      _votingDelay = newVotingDelay;
    }

    function setVotingPeriod(uint256 newVotingPeriod) 
        public 
        onlyGovernance()
    {
      _votingPeriod = newVotingPeriod;
    }

    function setProposalThreshold(uint256 newProposalThreshold) 
        public 
        onlyGovernance()
    {
      _proposalThreshold = newProposalThreshold;
    }

    function setProfileRegistry(address _hypernetProfileRegistry) 
        public 
        onlyGovernance()
    {
      hypernetProfileRegistry = _hypernetProfileRegistry;
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
        require(_preRegistered(_msgSender()), "Governance: caller must have a Hypernet Profile.");
        uint256 proposalId =  super.propose(targets, values, calldatas, description);

        // proposals start at 1
        uint256 proposalCount = _proposalIdTracker.current() + 1;
        _proposalMap[proposalCount] = proposalId;
        _proposalIdTracker.increment();
        proposalDescriptions[proposalId] = description;

        return proposalId;
    }

    function _execute(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
    {
        require(_preRegistered(_msgSender()), "Governance: caller must have a Hypernet Profile.");
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
        returns (uint256)
    {
        require(_preRegistered(_msgSender()), "Governance: caller must have a Hypernet Profile.");
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

    function _preRegistered(address owner) internal view virtual returns (bool) {
        // check if there if a Hypernet Profile is required and if so 
        // does the recipient have a non-zero balance. 
        return ((hypernetProfileRegistry == address(0)) || (IERC721(hypernetProfileRegistry).balanceOf(owner) > 0));
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