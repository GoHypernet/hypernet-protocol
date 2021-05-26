var Voting = artifacts.require("Voting.sol");
var SmartAccount = artifacts.require("SmartAccount.sol");
var SmartAccountRegistry = artifacts.require("SmartAccountRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(Voting);
  deployer.deploy(SmartAccount);
  deployer.deploy(SmartAccountRegistry);
  deployer.link(Voting, SmartAccount, SmartAccountRegistry);
};