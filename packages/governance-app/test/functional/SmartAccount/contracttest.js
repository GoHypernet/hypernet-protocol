/**
  * The purpose of this test contract is to test the functions in SmartAccount.sol
  * that involve altering the ownership of the contract.
  */

var SmartAccount = artifacts.require("SmartAccount");

contract('SmartAccount', function(accounts) {

    var smartAccount,
        owner,
        override,
        thirdparty;

    before("Setup the Smart Account contract and hydrate the required variables", function() {
        owner = accounts[0];
        override = owner;
        thirdparty = accounts[1];

        SmartAccount.new({from: owner})
        .then(function(data) {
            smartAccount = data;
        });

        return smartAccount,
        owner,
        thirdparty;
    });

    describe("Contract tests", function() {

        /**
          * Since the getOwner function can only be executed by the override account, this
          * test implies that if the owner is successfully returned, the override account
          * has been correctly set.
          */
        it("will have an owner with an override account that matches the creator of the contract", function() {
            return SmartAccount.new({from: override}).then(function(account) {
                return account.getOwner.call()
            }).then(function(response) {
                assert.equal(response.valueOf(), owner, "owner does not match override");
            });
        });

        it("will not allow a non-owner to execute the getOwner function", function() {
            return SmartAccount.new({from: thirdparty}).then(function(account) {
                return account.getOwner.call();
            }).then(function(error){
                assert.isOk(error, "Expected error has not been thrown");
            }).catch(function(error) {
                assert.isOk(error, "Expected error has been caught");
            });
        });

        it("will attempt to setOwner as a thirdparty user and fail", function() {
            return smartAccount.setOwner(thirdparty, {from: thirdparty}).then(function(error){
                assert.isOk(error, "Expected error has not been thrown");
            }).catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
            });
        });

        it("will attempt to setOverride as a thirdparty user and fail", function() {
            return smartAccount.setOverride(thirdparty, {from: thirdparty}).then(function(error){
                assert.isOk(error, "Expected error has not been thrown");
            }).catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
            });
        });

        it("will set thirdparty as the new owner by an override user (override is the owner)", function() {
            return smartAccount.setOwner(thirdparty, {from: override}).then(function(response) {
                var newOwnerStatus = response.logs[0].args.status;
                assert.equal(3, newOwnerStatus, "Transaction returned unexpected status");
                assert.isOk(response, 'Error produced by setOwner function');
            });
        });

        it("will verify that thirdparty is now the contract owner", function() {
            return smartAccount.getOwner.call().then(function(response) {
                assert.equal(response.valueOf(), thirdparty, "thirdparty is not the owner");
            });
        });

        it("will attempt to setOwner back to owner as the thirdparty user and fail as thirdparty is not override user", function() {
            return smartAccount.setOwner(owner, {from: thirdparty}).then(function(error){
                assert.isOk(error, "Expected error has not been thrown");
            }).catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
            });
        });

        it("will invoke the blocklock function when repeatedly setting a new owner as an override user", function() {
            return smartAccount.setOwner(thirdparty, {from: override}).then(function(){
                assert.isOk(error, "Expected error has not been thrown");
            }).catch(function(error) {
                assert.isOk(error, "Expected error has not been caught");
            });
        });

        it("will create a new contract then set override to a thirdparty user", function() {
            return SmartAccount.new({from: owner}).then(function(account) {
                return account.setOverride(thirdparty, {from: override})
            }).then(function(response) {
                var newOverrideStatus = response.logs[0].args.status;
                assert.equal(3, newOverrideStatus, "Transaction returned unexpected status");
                assert.isOk(response, "Expected error has not been caught");
            });
        });

        /**
          * Since 0.4.4, it may be preferable to change the contract to have a disabled
          * state, that also allows for the 'account' to be migrated to a new address.
          */
        it("will kill the contract as the owner", function() {
            return smartAccount.kill({from: thirdparty}).then(function() {
                assert.equal(0, web3.eth.getBalance(smartAccount.address).valueOf(), "Hmm, money still abounds.");
            });
        });
    });
}, 5000);
