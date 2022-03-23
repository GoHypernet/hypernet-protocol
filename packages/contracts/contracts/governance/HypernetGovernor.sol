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
 * @title Hypernet Protocol DAO
 * @author Todd Chapman
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
 *
 * See unit tests for example usage with Hypertoken:
 * https://github.com/GoHypernet/hypernet-protocol/blob/dev/packages/contracts/test/governance-test.js
 */
contract HypernetGovernor is Governor, GovernorCompatibilityBravo, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl {
    constructor(ERC20Votes _token, TimelockController _timelock)
        Governor("HypernetGovernor")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
        GovernorTimelockControl(_timelock)
    {}

    using Counters for Counters.Counter;

    /// @notice This mapping helps UI's fetch proposal ID's from the chain, its less gas efficient, but more self-contained
    /// @dev This public variable maps a 0-based index to a proposalID so that UI's don't have to rely on an indexing service
    mapping(uint256 => uint256) public _proposalMap;

    /// @notice This is a monotonically increasing counter that keeps track of the total number of proposals
    /// @dev This counter is incremented by one every time a proposal is created
    Counters.Counter public _proposalIdTracker; // track number of proposals in governance

    /// @notice This variable maps a proposalID to a description. 
    /// @dev It is recommended that descriptions be IPFS hashes instead of raw text descriptions to save costs
    mapping(uint256 => string) public proposalDescriptions; 

    /// @notice This returns the number of blocks that must be mined after a proposal is created before it becomes active
    /// @dev The token holder community should set this to an appropriate value after token launch: 1 block = approx 13 sec
    uint256 private _votingDelay = 1; 

    /// @notice This returns the number of blocks that a proposal remains active for
    /// @dev The token holder community should set this to an appropriate value after token launch: 1 block = approx 13 sec
    uint256 private _votingPeriod = 20; // blocks

    /// @notice The proposal threshold is the number of tokens required to create a proposal
    /// @dev The token holder community should set this to an appropriate value after token launch: there are 18 decimals in H
    uint256 private _proposalThreshold = 1_000_000e18; // number of votes required to in order to submit a successful proposal

    /// @notice This address points to the Hypernet Profiles registy. A user must obtain a Hypernet Profile to participate in the DAO
    /// @dev If this variable is set to the zero address, then the propose and execute functions do not require caller to own a Hypernet Profile
    address public hypernetProfileRegistry = address(0);

    /// @notice A getter function for the _votingDelay variable
    /// @dev This is a dedicated funcion for returning _votingDelay
    function votingDelay() public view override returns (uint256) {
        return _votingDelay; 
    }

    /// @notice A getter function for the _votingPeriod variable
    /// @dev This is a dedicated funcion for returning _votingPeriod
    function votingPeriod() public view override returns (uint256) {
        return _votingPeriod; 
    }

    /// @notice A getter function for the _proposalThreshold variable
    /// @dev This is a dedicated funcion for returning _proposalThreshold
    function proposalThreshold() public view override returns (uint256) {
        return _proposalThreshold; 
    }

    /// @notice This function updates the DAO's _votingDelay parameter
    /// @dev Only the DAO timelock contract can call this function
    /// @param newVotingDelay The number of blocks to wait before new proposal are active
    function setVotingDelay(uint256 newVotingDelay) 
        public 
        onlyGovernance()
    {
      _votingDelay = newVotingDelay;
    }

    /// @notice This function updates the DAO's _votingPeriod parameter
    /// @dev Only the DAO timelock contract can call this function
    /// @param newVotingPeriod The number of blocks that a proposal remains active
    function setVotingPeriod(uint256 newVotingPeriod) 
        public 
        onlyGovernance()
    {
      _votingPeriod = newVotingPeriod;
    }

    /// @notice This function updates the DAO's _proposalThreshold parameter
    /// @dev Only the DAO timelock contract can call this function
    /// @param newProposalThreshold The number of Hypertoken required to create a proposal, remember there are 18 decimal places
    function setProposalThreshold(uint256 newProposalThreshold) 
        public 
        onlyGovernance()
    {
      _proposalThreshold = newProposalThreshold;
    }

    /// @notice This function sets the address of the NFR to use for gating the propose and execute functions
    /// @dev Only the DAO timelock contract can call this function
    /// @param _hypernetProfileRegistry The new address to use for the gating NFR. If set to the 0 address, then gating is deactivated.
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