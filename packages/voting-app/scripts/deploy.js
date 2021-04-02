var HypernetlabsVoting = artifacts.require("HypernetlabsVoting.sol");
var SmartAccount = artifacts.require("SmartAccount.sol");
var SmartAccountRegistry = artifacts.require("SmartAccountRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(HypernetlabsVoting);
  deployer.deploy(SmartAccount);
  deployer.deploy(SmartAccountRegistry);
  deployer.link(HypernetlabsVoting, SmartAccount, SmartAccountRegistry);
};